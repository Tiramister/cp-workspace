#!/bin/sh

if [ ${PWD##*/} != 'infra' ]; then
  echo '[ERROR] Run this script in the infra directory.'
  exit 1
fi

image_name='tiramister/rust-cp-workspace'
container_name='rust-cp-container'
 
if ! docker image ls -a | grep -q $image_name; then
  docker pull $image_name
fi
if ! docker container ls -a | grep -q $container_name; then
  docker container create \
    --name $container_name \
    --mount type=bind,source=$(dirname $PWD),target='/home/tiramister/workspace/' \
    $image_name
fi

docker container start $container_name
docker container exec -it --env 'TERM=xterm-256color' $container_name /bin/zsh
docker container stop $container_name

