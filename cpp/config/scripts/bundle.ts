import { exists } from "@std/fs/exists";
import { copy } from "@std/fs/copy";
import * as path from "@std/path";
import { encodeHex } from "@std/encoding";

const WORKSPACE_DIR = path.join(Deno.cwd(), "workspace");

function info(message: string) {
  console.log(`[INFO] ${message}`);
}

// main.cpp のハッシュを更新する async 関数を返す。
// ハッシュが変わっていない場合は null を返す。
async function checksum_updater(): Promise<Promise<() => void> | null> {
  const mainCppPath = path.join(WORKSPACE_DIR, "main.cpp");
  const newCheckSum = encodeHex(
    await crypto.subtle.digest("SHA-256", await Deno.readFile(mainCppPath)),
  );

  const configPath = path.join(WORKSPACE_DIR, "config.json");
  const config = JSON.parse(await Deno.readTextFile(configPath));
  const oldCheckSum = config.check_sum;

  if (oldCheckSum === newCheckSum) {
    return null;
  }

  return async () => {
    const configPath = path.join(WORKSPACE_DIR, "config.json");
    const config = JSON.parse(await Deno.readTextFile(configPath));
    config.check_sum = newCheckSum;
    await Deno.writeTextFile(configPath, JSON.stringify(config));
  };
}

async function expand(
  filePath: string,
  libPaths: string[],
  bundledLibs: string[],
): Promise<string> {
  const bundledTextLines: string[] = [];

  const text = await Deno.readTextFile(filePath);
  for (const line of text.split("\n")) {
    // #include <foo>
    // #include "bar/bar.cpp"
    const includeMatch = line.match(/^#include\s*[<"]([\w/.]*)[>"]/);
    if (includeMatch) {
      const libRelPath = includeMatch[1];

      // 該当するライブラリファイルを探す
      let libAbsPath = "";
      for (const libPath of libPaths) {
        const candidatePath = path.join(libPath, libRelPath);
        if (await exists(candidatePath)) {
          libAbsPath = candidatePath;
          break;
        }
      }

      // ライブラリが存在しない場合、標準ライブラリとみなす
      // 既に展開されている場合もスキップする
      if (libAbsPath && !bundledLibs.includes(libAbsPath)) {
        // 再帰的にライブラリを展開する
        bundledLibs.push(libAbsPath);
        bundledTextLines.push(await expand(libAbsPath, libPaths, bundledLibs));
        continue;
      }
    }

    bundledTextLines.push(line);
  }

  return bundledTextLines.join("\n");
}

function rearrange(text: string): string {
  const libs = new Set<string>();
  const textLines: string[] = [];

  let inIf = false;
  let inMscVer = false;
  for (const line of text.split("\n")) {
    // #ifdef _MSC_VER
    if (line.trim() == "#ifdef _MSC_VER") {
      inIf = true;
      inMscVer = true;
      continue;
    }
    if (line.trim() == "#ifndef _MSC_VER") {
      inIf = true;
      inMscVer = false;
      continue;
    }
    if (inIf && line.trim() == "#else") {
      inMscVer = !inMscVer;
      continue;
    }
    if (inIf && line.trim() == "#endif") {
      inIf = false;
      inMscVer = false;
      continue;
    }

    // 飛ばしていい行
    if (
      inMscVer ||
      line.match(/#.*ATCODER_[A-Z_]*_HPP/) || // ac-library でのマクロ定数定義
      line.trim() == "#pragma once" || // include ガード
      line.trim().startsWith("//") // コメント行
    ) {
      continue;
    }

    // #include <foo>
    // #include "bar/bar.cpp"
    const includeMatch = line.match(/^#include\s*[<"]([\w/.]*)[>"]/);
    if (includeMatch) {
      const libName = includeMatch[1];
      libs.add(libName);
    } else {
      textLines.push(line);
    }
  }

  const libLines = [...libs].map((lib) => `#include <${lib}>`);
  return [...libLines, "", ...textLines].join("\n");
}

async function main() {
  // main.cpp に更新があったかどうかを確認する
  const checksumUpdater = await checksum_updater();
  if (!checksumUpdater) {
    info("main.cpp に更新がなかったため、bundle をスキップします。");
    return;
  }

  // ライブラリを展開する
  const libPaths = ["./config/libs"];
  // const libPaths = ["./config/ac-library", "./config/libs"];
  const expandedText = await expand(
    path.join(WORKSPACE_DIR, "main.cpp"),
    libPaths,
    [],
  );

  // フォーマットする
  const rearrangedText = rearrange(expandedText);

  await Deno.writeTextFile(
    path.join(WORKSPACE_DIR, "bundled.cpp"),
    rearrangedText,
  );

  // 最後に checksum を更新する
  checksumUpdater();
}

await main();
