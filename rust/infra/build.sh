#!/bin/sh

if [ ${PWD##*/} != 'infra' ]; then
  echo "[ERROR] Run this script in the infra directory."
  exit 1
fi

if ! docker container ls -a | grep -q 'cp-rust-container'; then
  docker container rm cp-rust-container
fi
if ! docker image ls -a | grep -q 'cp-rust-image'; then
  docker image rm cp-rust-image
fi

# echo などの標準出力も出力したい場合は、 --progress=plain を指定
# ユーザ名(デフォルトで tiramister) を変更したい場合は、--build-arg に user=$user を追加
docker build --build-arg uid=$UID -t cp-rust-image .

