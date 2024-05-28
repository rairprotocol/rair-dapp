#!/usr/bin/env bash

# This will install Docker into our "Bitbucket Pipeline" container for local testing

apt-get update 

apt-get --no-install-recommends install -y ca-certificates curl gnupg lsb-release 

mkdir -p /etc/apt/keyrings 

curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg \

echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null 

apt-get update 

apt-get --no-install-recommends install -y docker-ce docker-ce-cli containerd.io