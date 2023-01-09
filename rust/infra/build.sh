#!/bin/sh

if [ ${PWD##*/} != 'infra' ]; then
  echo "[ERROR] Run this script in the infra directory."
  exit 1
fi

# echo などの標準出力も出力したい場合は、 --progress=plain を指定
docker build --build-arg uid=$UID -t cp-rust-image .

