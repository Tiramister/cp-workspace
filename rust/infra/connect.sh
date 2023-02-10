#!/bin/sh

if [ $# -lt 1 ]; then
  echo "[ERROR] Specify the instance ID" >&2
  exit 1
fi

instance_id=$1

aws ec2 start-instances --instance-ids $instance_id

public_ip=""
while [ -z $public_ip ]; do
  public_ip=$(aws ec2 describe-instances --instance-ids $instance_id \
      --query 'Reservations[*].Instances[*].PublicIpAddress' \
      --output text)
done
echo "[INFO] Public IP: $public_ip" >&2

while ssh -o StrictHostKeyChecking=no -l ubuntu $public_ip; do
  echo "[ERROR] Failed to connect to the server. Try again..." >&2
done

aws ec2 stop-instances --instance-ids $instance_id

