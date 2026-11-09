import {parse} from "jsr:@std/toml@^1.0.11";
import chalk from 'npm:chalk';

const SAMPLE_PATH = "workspace/sample.toml";
const EXECUTABLE_PATH = "./build/a.out";
const TIMEOUT_MS = 5_000;

type Sample = {
    input: string;
    output: string;
};

type Verdict = "AC" | "WA" | "TLE";

type ExecutionResult = {
    timedOut: boolean;
    success: boolean;
    code: number;
    stdout: string;
    stderr: string;
};

const verdictToText: Map<string, string> = new Map([
    ["AC", chalk.white.bgGreenBright.bold(" AC ")],
    ["WA", chalk.white.bgYellowBright.bold(" WA ")],
    ["TLE", chalk.white.bgYellowBright.bold(" TLE ")],
]);

const decoder = new TextDecoder();
const FLOAT_RE = /^[+-]?(?:(?:\d+\.\d*|\.\d+)(?:[eE][+-]?\d+)?|\d+[eE][+-]?\d+)$/;
const NUMBER_RE = /^([+-]?)(\d*)(?:\.(\d*))?(?:[eE]([+-]?\d+))?$/;

function isSample(value: unknown): value is Sample {
    return typeof value === "object" && value !== null &&
        "input" in value && typeof value.input === "string" &&
        "output" in value && typeof value.output === "string";
}

function tokens(text: string): string[] {
    const trimmed = text.trim();
    return trimmed === "" ? [] : trimmed.split(/\s+/);
}

// 小数第9位より下を切り捨て、10^-9 単位の整数に変換する。
// BigInt を使うため JavaScript の浮動小数点誤差を受けない。
function nanoUnits(token: string): bigint | null {
    const match = NUMBER_RE.exec(token);
    if (!match || !(match[2] || match[3])) return null;

    const exponent = Number(match[4] ?? "0");
    if (!Number.isSafeInteger(exponent) || Math.abs(exponent) > 10_000) {
        return null;
    }

    const digits = match[2] + (match[3] ?? "");
    const shift = exponent - (match[3]?.length ?? 0) + 9;
    const scaled = shift >= 0
        ? digits + "0".repeat(shift)
        : digits.slice(0, Math.max(0, digits.length + shift)) || "0";
    const value = BigInt(scaled);
    return match[1] === "-" ? -value : value;
}

function tokenEquals(expected: string, actual: string): boolean {
    if (expected === actual) return true;

    // 少なくとも一方が小数・指数表記なら数値として比較する。
    if (!(FLOAT_RE.test(expected) || FLOAT_RE.test(actual))) return false;
    const a = nanoUnits(expected);
    const b = nanoUnits(actual);
    return a !== null && b !== null && a === b;
}

function outputEquals(expected: string, actual: string): boolean {
    const a = tokens(expected);
    const b = tokens(actual);
    return a.length === b.length && a.every((token, i) => tokenEquals(token, b[i]));
}

async function runSample(input: string): Promise<ExecutionResult> {
    const child = new Deno.Command(EXECUTABLE_PATH, {
        stdin: "piped",
        stdout: "piped",
        stderr: "piped",
    }).spawn();

    // stdin の書き込みと stdout/stderr の回収を並行して行う。
    // プログラムが入力を読み切らずに終了すると書き込みが失敗し得る。
    const writing = new Blob([input]).stream().pipeTo(child.stdin).catch(() => {
    });

    let timedOut = false;
    const timer = setTimeout(() => {
        timedOut = true;
        try {
            child.kill("SIGKILL");
        } catch {
            // タイマー発火直前に終了していた場合など。
        }
    }, TIMEOUT_MS);

    // 出力の回収に時間がかかっても、プロセスが終了済みなら TLE にしない。
    void child.status.then(() => clearTimeout(timer));

    try {
        const result = await child.output();
        await writing;
        return {
            timedOut,
            success: result.success,
            code: result.code,
            stdout: decoder.decode(result.stdout),
            stderr: decoder.decode(result.stderr),
        };
    } finally {
        clearTimeout(timer);
    }
}

async function main(): Promise<void> {
    console.log("Building: mise run debug");
    const build = await new Deno.Command("mise", {
        args: ["run", "debug"],
        stdin: "inherit",
        stdout: "inherit",
        stderr: "inherit",
    }).spawn().status;

    if (!build.success) {
        throw new Error(`ビルドに失敗しました (exit code: ${build.code})`);
    }

    const parsed = parse(await Deno.readTextFile(SAMPLE_PATH));
    const rawSamples = parsed.samples;
    if (!Array.isArray(rawSamples) || !rawSamples.every(isSample)) {
        throw new Error(`${SAMPLE_PATH}: samples は input/output を持つ配列にしてください`);
    }
    const samples: Sample[] = rawSamples;

    const counts = new Map([["AC", 0], ["WA", 0], ["TLE", 0]]);
    for (const [i, sample] of samples.entries()) {
        const execution = await runSample(sample.input);
        const verdict: Verdict = execution.timedOut
            ? "TLE"
            : execution.success && outputEquals(sample.output, execution.stdout)
                ? "AC"
                : "WA"
        counts.set(verdict, counts.get(verdict) + 1);

        console.log("========================================")
        console.log(`case ${i + 1}: ${verdictToText.get(verdict)}`);
        console.log(`[input]\n${sample.input.trim()}\n`);
        console.log(`[expected]\n${sample.output.trim()}\n`);
        if (verdict === "WA") {
            console.log(`[actual]\n${execution.stdout.trim()}\n`);
            if (!execution.success) {
                console.log(`exit code: ${execution.code}`);
            }
        }
        if (execution.stderr) {
            console.log(`[stderr]\n${execution.stderr.trim()}\n`);
        }
    }

    console.log(`Result: ${verdictToText.get("AC")}=${counts.get("AC")}, ${verdictToText.get("WA")}=${counts.get("WA")}, ${verdictToText.get("TLE")}=${counts.get("TLE")}`);
}

await main();
