## 想定環境

以下が使えることを想定している。

* Python3
* [oj](https://github.com/online-judge-tools/oj)
* [Online Judge Verification Helper](https://github.com/online-judge-tools/verification-helper) (bundleでのみ使う)

また、一部macOSでしか使えない機能もある。


## 使い方

### workspace

| コマンド | 内容 |
| :---: | :--- |
| `make gen` | 作業用ディレクトリを6つ作る。 |
| `make gen D=10` | 作業用ディレクトリを10個作る(1個以上26個以下のみ指定可能)。 |
| `make clean` | `setting`と`Makefile`以外のファイル・ディレクトリをすべて消す。 |

### 作業用ディレクトリ

| コマンド | 内容 |
| :---: | :--- |
| `make clean` | `make gen`直後の、`main.cpp`と`Makefile`しかない状態に戻す。 |
| `make`       | コンパイルを行う。 |
| `make ex`    | ac-libraryの展開を行い、`combined.cpp`を生成する。 |
| `make cp`    | `main.cpp`をクリップボードにコピーする(macOSのみ)。 |
| `make s`     | `main.cpp`(あれば`combined.cpp`)に`oj-bundle`を行ったコードを提出する。 |

以下注意点。

* デフォルトのコンパイルオプションは、デバッグ用のかなり遅いものである。コンパイルオプションを変えるときは`Makefile`内の`CFLAGS`を編集する。

* `make s`を行うとき、過去に問題ページに対して`oj d`を行っていなければならない(そのうちURLを指定できるようにする予定)。

* `make s`にて、環境変数`CPLUS_INCLUDE_PATH`で指定されているパスが全て`oj-bundle`に渡されるようになっている。

## 設定

使う前に、`setting/base/Makefile`で以下の変数を設定する必要がある。

| 変数 | 内容 |
| :---: | :--- |
| `EXPANDER` | ac-libraryに付属している`expander.py`のパス |

以下の変数を上手く変更すれば、他言語にも対応できるかもしれない(多分スクリプト言語は厳しい)。

| 変数 | 内容 |
| :---: | :--- |
| `EXT` | ソースコードの拡張子 |
| `CC`  | コンパイルコマンド |
| `CFLAGS` | コンパイルオプション |
