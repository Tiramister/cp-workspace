import {exists} from "@std/fs/exists";
import {copy} from "@std/fs/copy";
import {assert} from "@std/assert";
import * as path from "@std/path";

const WORKSPACE_DIR = path.join(Deno.cwd(), "workspace");
const ARCHIVES_DIR = path.join(Deno.cwd(), "archives");
const BASE_DIR = path.join(Deno.cwd(), "config", "base")

function info(message: string) {
    console.log(`[INFO] ${message}`);
}

/**
 * 現在の workspace を archives に移動する。
 */
async function archive() {
    if (!(await exists(WORKSPACE_DIR, {isDirectory: true}))) {
        info("workspace が存在しないため、アーカイブをスキップします。");
        return;
    }

    // 問題 ID の取得
    const configPath = path.join(WORKSPACE_DIR, "config.json");
    assert(
        await exists(configPath, {isFile: true}),
        "config.json が存在しません。",
    );

    const config = JSON.parse(await Deno.readTextFile(configPath));
    const currentProblemId = config.problemId;
    assert(currentProblemId, "config.json に problemID が存在しません。");

    // archives へ移動
    if (!(await exists(ARCHIVES_DIR, {isDirectory: true}))) {
        await Deno.mkdir("./archives");
    }

    const archivePath = path.join(ARCHIVES_DIR, currentProblemId);
    assert(!(await exists(archivePath)), `${archivePath} は既に存在します。`);

    await Deno.rename(WORKSPACE_DIR, archivePath);
    info(`アーカイブ: ${WORKSPACE_DIR} -> ${archivePath}`);
}

/**
 * archives から workspace に戻す。
 * 指定した問題 ID が archives になければ false を返す。
 * @param problemId
 */
async function load(problemId: string): Promise<boolean> {
    assert(!(await exists(WORKSPACE_DIR)), "workspace は既に存在します。");

    const archivePath = path.join(ARCHIVES_DIR, problemId);
    if (!(await exists(archivePath))) {
        return false;
    }

    await Deno.rename(archivePath, WORKSPACE_DIR);
    info(`復旧: ${archivePath} -> ${WORKSPACE_DIR}`);
    return true;
}

/**
 * workspace を作成する。
 */
async function create(problemId: string) {
    assert(!(await exists(WORKSPACE_DIR)), "workspace は既に存在します。");
    assert(
        !(await exists(path.join(ARCHIVES_DIR, problemId))),
        "archives に問題 ID が既に存在します。",
    );

    await copy(BASE_DIR, WORKSPACE_DIR);

    // 問題 ID を設定する
    const configPath = path.join(WORKSPACE_DIR, "config.json");
    await Deno.writeTextFile(configPath, JSON.stringify({problemId}));

    info(`新規作成: ${problemId}`);
}

async function main() {
    const problemId = Deno.args[0];
    assert(problemId, "問題 ID が指定されていません。");

    try {
        await archive();
    } catch (e) {
        throw new Error("workspace のアーカイブに失敗しました。", {cause: e});
    }

    const loaded = await (async () => {
        try {
            return await load(problemId);
        } catch (e) {
            throw new Error("archive からの復旧に失敗しました。", {cause: e});
        }
    })();

    if (!loaded) {
        try {
            await create(problemId);
        } catch (e) {
            throw new Error("workspace の作成に失敗しました。", {cause: e});
        }
    }
}

await main();
