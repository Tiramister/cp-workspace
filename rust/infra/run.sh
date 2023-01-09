#!/bin/sh

if [ ${PWD##*/} != 'infra' ]; then
  echo "[ERROR] Run this script in the infra directory."
  exit 1
fi
 
if ! docker container ls -a | grep -q 'cp-rust-container'; then
  docker container create \
    --name cp-rust-container \
    --mount type="bind",source="$(dirname ${PWD})",target="/home/tiramister/workspace/" \
    cp-rust-image
fi

docker container start cp-rust-container
docker container exec -it --env "TERM=xterm-256color" cp-rust-container /bin/zsh
docker container stop cp-rust-container

