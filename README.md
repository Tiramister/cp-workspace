# Workspace for Competitive Programming in C++

C++ で競技プログラミングをする際の作業ディレクトリ。


## 想定環境

以下が使えることを想定している。

* Makefile
* Python3

またクリップボードへのコピー等、一部macOSでしか使えない機能がある。


## 使い方

### workspace

| コマンド | 内容 |
| :-: | :-- |
| `make gen`      | 作業用ディレクトリを1つ作る。 |
| `make gen D=10` | 作業用ディレクトリを10個作る(1個以上26個以下のみ指定可能)。 |
| `make clean`    | `setting` と `Makefile` 以外のファイル・ディレクトリをすべて消す。 |

### 作業用ディレクトリ

| コマンド | 内容 |
| :-: | :-- |
| `make clean` | `make gen` 直後の、 `main.cpp` と `Makefile` しかない状態に戻す。 |
| `make (d)`   | デバッグコンパイルを行う。遅いがエラーが詳細に表示される。 |
| `make f`     | リリースコンパイルを行う。速い。 |
| `make ex`    | [ac-library](https://github.com/atcoder/ac-library) の展開を行い、 `combined.cpp` を生成する(後述の設定も参照)。 |
| `make cp`    | `main.cpp` をクリップボードにコピーする(macOSのみ)。 |


## 設定

使う前に、 `setting/base/Makefile` で以下の変数を設定する必要がある。

| 変数 | 内容 |
| :-: | :-- |
| `EXPANDER` | [ac-library](https://github.com/atcoder/ac-library) に付属している `expander.py` へのパス。 |

以下の変数を上手く変更すれば、他言語にも対応できるかもしれない。

| 変数 | 内容 |
| :-: | :-- |
| `EXT`          | ソースコードの拡張子 |
| `CC`           | コンパイルコマンド |
| `CDEBUG_FLAGS` | デバッグコンパイルのオプション |
| `CFAST_FLAGS`  | リリースコンパイルのオプション |
