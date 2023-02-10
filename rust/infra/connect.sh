#!/bin/sh

if [ $# -lt 1 ]; then
  echo '[ERROR] Specify the instance ID' >&2
  exit 1
fi

instance_id=$1

function get_state() {
  state=$(aws ec2 describe-instances --instance-ids $instance_id \
    --query 'Reservations[*].Instances[*].State.Name' \
    --output text)
  echo "[INFO] Current state: $state" >&2
  echo $state
}

aws ec2 start-instances --instance-ids $instance_id

public_ip=''
while [ -z $public_ip ]; do
  public_ip=$(aws ec2 describe-instances --instance-ids $instance_id \
      --query 'Reservations[*].Instances[*].PublicIpAddress' \
      --output text)
done
echo "[INFO] Public IP: $public_ip" >&2

while [ "$(get_state)" != 'running' ]; do
  sleep 5
done

while :; do
  ssh -o StrictHostKeyChecking=no -l ubuntu $public_ip

  if [ "$?" -eq 0 ]; then
    break
  else
    echo "[ERROR] Failed to connect to the server. Try in 5 secs..."
    sleep 5
  fi
done

aws ec2 stop-instances --instance-ids $instance_id
while [ "$(get_state)" != 'stopped' ]; do
  sleep 5
done

