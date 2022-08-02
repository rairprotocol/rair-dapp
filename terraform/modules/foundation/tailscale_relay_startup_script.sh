#!/bin/bash

echo "TAILSCALE RELAY STARTUP SCRIPT STARTED"

# Pull Tailscale auth key from google secrets storage
TAILSCALE_AUTH_KEY=$(gcloud secrets versions access latest --secret=${tailscale_auth_key_secret_name})

######################################################
# Install Tailscale
# Official install docs here:
# https://tailscale.com/download/linux

apt-get -y install apt-transport-https
curl -fsSL https://pkgs.tailscale.com/stable/debian/${debian_version_name}.gpg | sudo apt-key add -
curl -fsSL https://pkgs.tailscale.com/stable/debian/${debian_version_name}.list | sudo tee /etc/apt/sources.list.d/tailscale.list
apt-get -y update
apt-get -y install tailscale
# End Install Tailscale
######################################################

######################################################
# Begin Configure IP forwarding on Linnux
# Docs here
# https://tailscale.com/kb/1104/enable-ip-forwarding
echo 'net.ipv4.ip_forward = 1' | tee -a /etc/sysctl.conf
echo 'net.ipv6.conf.all.forwarding = 1' | tee -a /etc/sysctl.conf
sysctl -p /etc/sysctl.conf
# End condfigure IP forwarding
######################################################

# Boot Tailscale
tailscale up \
  --hostname=${hostname} \
  --advertise-tags=${tags} \
  --advertise-routes=${advertised_routes} \
  --authkey=$TAILSCALE_AUTH_KEY

echo "TAILSCALE RELAY STARTUP SCRIPT COMPLETE"