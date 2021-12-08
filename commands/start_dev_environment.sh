#!/bin/bash

echo "Starting dev environment..."

DIR=$(dirname $0)

docker-compose -f $DIR/../docker-compose.local.yml build
docker-compose -f $DIR/../docker-compose.local.yml up