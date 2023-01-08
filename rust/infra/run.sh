#!/bin/sh

if [ ! -d infra ]; then
  echo "[ERROR] Run this script in the infra directory."
  exit 1
fi

docker run --rm -it \
  --name cp-rust-container \
  --mount type="bind",source="../$(pwd)",target="/home/tiramister/workspace/" \
  cp-rust-image /bin/zsh

