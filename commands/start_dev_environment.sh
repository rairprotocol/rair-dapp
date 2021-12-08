#!/bin/bash

echo "Starting dev environment..."

DIR=$(dirname $0)

DOCKER_COMPOSE_YML=$DIR/../docker-compose.local.yml

docker-compose -f $DOCKER_COMPOSE_YML build
docker-compose -f $DOCKER_COMPOSE_YML up