#!/bin/sh

# 標準エラー出力に出力してからエラーコード1で終了
abort() {
  if [ $# -ne 0 ]; then echo $@ >&2; fi
  exit 1
}

if [ $# -eq 0 ]; then
  abort "Usage: ./init.sh <problem name or problem url>"
fi

problem="$1" 
hashed=$(echo "${problem}" | sha1sum - | head -c 40)

problem_dir="./cache/${hashed}"

# キャッシュを作成
if [ ! -d "${problem_dir}" ]; then
  mkdir -p "${problem_dir}"
  cp ./template.rs "${problem_dir}/main.rs"
  oj d "${problem}" -d "${problem_dir}/test"
fi

# キャッシュへシンボリックリンクを貼る(ロード)
mkdir -p "./src"
rm -f ./src/main.rs && ln -sf "../${problem_dir}/main.rs" ./src/main.rs
rm -f ./test && ln -sf "./${problem_dir}/test" ./test
