#!/usr/bin/env bash

# frontend_build_success_pipeline.sh
# Written by Zeph
# May 2022

DOCKERFILE="$BITBUCKET_CLONE_DIR/minting-marketplace/"

output "*" "Building Minting-Network Test Image..."

docker build -t buildtest $DOCKERFILE --progress=plain