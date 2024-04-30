#!/bin/bash

set -e

echo "Starting dev environment..."

DIR=$(dirname $0)

DOCKER_COMPOSE_YML=$DIR/../docker-compose.local.yml

################################
################################
# Build Containers

function progress_log {
  echo "###############################################"
  echo "# $1"
  echo "###############################################"
}

progress_log "DOWN"
docker-compose \
  -f $DOCKER_COMPOSE_YML \
  down

progress_log "BUILD"
docker-compose \
  -f $DOCKER_COMPOSE_YML \
  build \
  --progress=plain

################################
################################
# Boot Containers

# Booting up each docker container in a specific order
# For now we're using simple sleep commands to give them space
# but in the future, conditional checks using curl / ping can be used
# before allowing the boot process to continue

# This prevents container boot race conditions
# For example: blockchain-networks depends on mongo
# If mongo boots later for some reason, blockchain-networks may fail

progress_log "mongo UP"
docker-compose \
  --file $DOCKER_COMPOSE_YML up \
  --detach mongo
# wait a few seconds for mongo to boot
sleep 10

progress_log "blockchain-networks UP"
# We're running with -d to keep the logs from interrupting the bash script
docker-compose \
  --file $DOCKER_COMPOSE_YML up \
  --detach blockchain-networks

progress_log "minting-network UP"
docker-compose \
  --file $DOCKER_COMPOSE_YML up \
  --detach minting-network

progress_log "rairnode UP"
docker-compose \
  --file $DOCKER_COMPOSE_YML up \
  --detach rairnode

progress_log "Start logs"
# finally, print all logs
docker-compose logs \
  --follow