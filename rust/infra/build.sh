#!/bin/sh

if [ ! -d infra ]; then
  echo "[ERROR] Run this script in the infra directory."
  exit 1
fi

docker build -t cp-rust-image ..

