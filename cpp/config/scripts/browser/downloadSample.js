// ==UserScript==
// @name         AtCoder Sample Downloader
// @namespace    https://atcoder.jp/
// @version      1.0.0
// @description  問題ページの入力例・出力例を空白や改行を保持した TOML としてダウンロードする。
// @match        https://atcoder.jp/contests/*/tasks/*
// @run-at       document-idle
// ==/UserScript==

function addSampleDownloadButton() {
    // 「解説」ボタンを検索する
    // <span class="h2">問題名 <a href=".../editorial">解説</a></span>
    const editorialButton = document.querySelector('#main-container .h2 > a[href$="/editorial"]');
    if (!editorialButton) throw new Error('解説ボタンが見つかりません。');

    // 「サンプルをコピー」ボタンを作る
    const button = document.createElement('button');
    button.id = 'vm-copy-atcoder-samples';
    button.type = 'button';
    button.className = 'btn btn-default btn-sm';
    button.textContent = 'サンプルをダウンロード';
    button.style.marginLeft = '6px';

    editorialButton.insertAdjacentElement('afterend', button);
    return button;
}

function collectSamples() {
    const statement = document.querySelector('#task-statement');
    if (!statement) throw new Error('問題文が見つかりません。');

    // 日本語・英語の両方が DOM にあるため、表示中の言語だけを対象にする。
    const languages = [...statement.querySelectorAll('.lang > .lang-ja, .lang > .lang-en')];
    const root = languages.find((el) => getComputedStyle(el).display !== 'none')
        || languages[0]
        || statement;

    const samples = new Map();
    for (const heading of root.querySelectorAll('h3')) {
        const title = heading.textContent.trim();
        console.log({ title });
        const match = title.match(/^(入力例|出力例)\s*([0-9]+)/)
            || title.match(/^Sample\s+(Input|Output)\s+([0-9]+)/i);
        if (!match) continue;

        const number = Number(match[2]);
        const kind = /^(入力例|Input)$/i.test(match[1]) ? 'input' : 'output';
        const pre = heading.closest('section')?.querySelector('pre');
        if (!pre) throw new Error(`${title} のデータが見つかりません。`);

        if (!samples.has(number)) samples.set(number, {});
        // trim() や innerText は使わず、スペース・タブ・末尾の改行を残す。
        samples.get(number)[kind] = pre.textContent;
    }

    if (samples.size === 0) throw new Error('入力例・出力例が見つかりません。');
    for (const [number, sample] of samples) {
        if (sample.input === undefined || sample.output === undefined) {
            throw new Error(`サンプル ${number} の入力または出力がありません。`);
        }
    }
    return [...samples.entries()].sort(([a], [b]) => a - b);
}

function toToml(samples) {
    return samples.map(([, { input, output }]) =>
        `[[samples]]
input = ${JSON.stringify(input)}
output = ${JSON.stringify(output)}`
    ).join('\n\n') + '\n';
}

(() => {
    'use strict';

    // 問題本文のページだけで実行する。
    const match = location.pathname.match(
        /^\/contests\/[^/]+\/tasks\/([^/]+)\/?$/
    );
    if (!match) return;

    const button = addSampleDownloadButton();

    button.addEventListener('click', async () => {
        try {
            // TOML テキストをダウンロードさせる URL を作る
            const toml = toToml(collectSamples());
            const blob = new Blob([toml], {
                type: 'application/toml;charset=utf-8'
            });
            const url = URL.createObjectURL(blob);

            // この URL へ遷移する anchor 要素を作ってクリックする
            const a = document.createElement('a');
            a.href = url;
            a.download = 'sample.toml';

            document.body.appendChild(a);
            a.click();
            a.remove();

            // ダウンロード処理に余裕を持たせて URL を解放する。
            setTimeout(() => URL.revokeObjectURL(url), 60000);
        } catch (error) {
            console.error('[AtCoder Samples to TOML]', error);
            alert(`サンプルの保存に失敗しました: ${error.message}`);
        }
    });
})();
