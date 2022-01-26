#!/bin/bash

# set -e

echo "TAILSCALE RELAY STARTUP SCRIPT STARTED"


sleep 10

# Install directions here:
# https://tailscale.com/download/linux/debian-stretch

# Google directions here: 
# https://cloud.google.com/sdk/docs/install#deb
# sudo apt-get install apt-transport-https ca-certificates gnupg

yes | apt-get -y install apt-transport-https
echo "--------- 1"
# curl -fsSL https://pkgs.tailscale.com/stable/debian/stretch.gpg | sudo apt-key add -
echo "--------- 2"
# curl -fsSL https://pkgs.tailscale.com/stable/debian/stretch.list | sudo tee /etc/apt/sources.list.d/tailscale.list
echo "--------- 3"
yes | apt-get -y update
echo "--------- 4"
yes | apt-get -y install tailscale

TAILSCALE_AUTH_SECRET_NAME={tailscale_auth_key_secret_name}

echo "--------- 5"

TAILSCALE_AUTH_KEY=$(gcloud secrets versions access latest --secret=$TAILSCALE_AUTH_KEY)

echo "--------- 6"
sudo tailscale up \
  --advertise-tags= {tags} \
  --advertise-routes={advertised_routes} \
  --authkey=$TAILSCALE_AUTH_KEY

echo "TAILSCALE RELAY STARTUP SCRIPT COMPLETE"