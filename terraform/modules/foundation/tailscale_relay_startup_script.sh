#!/bin/bash

echo "TAILSCALE RELAY STARTUP SCRIPT STARTED"

# Official tailscale install directions here:
# https://tailscale.com/download/linux/debian-stretch
apt-get -y install apt-transport-https
curl -fsSL https://pkgs.tailscale.com/stable/debian/stretch.gpg | sudo apt-key add -
curl -fsSL https://pkgs.tailscale.com/stable/debian/stretch.list | sudo tee /etc/apt/sources.list.d/tailscale.list
apt-get -y update
apt-get -y install tailscale

TAILSCALE_AUTH_KEY=$(gcloud secrets versions access latest --secret=${tailscale_auth_key_secret_name})

tailscale up \
  --hostname=${hostname} \
  --advertise-tags=${tags} \
  --advertise-routes=${advertised_routes} \
  --authkey=$TAILSCALE_AUTH_KEY

echo "TAILSCALE RELAY STARTUP SCRIPT COMPLETE"