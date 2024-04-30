#!/usr/bin/env bash

# pipeline_docker_build_init.sh
# Written by Zeph
# June 2022

# This script initializes the build of a Bitbucket Pipeline image using Docker.

divider="-----------------------------------------------"

function output {
    type=$1 # "*" for general output and "!" for errors
    msg=$2
    ([ "$type" = "*" ] && printf "\n$divider\n%s\n$divider\n" "[*] $msg") || \
        ([ "$type" = "!" ] && { printf "\n$divider\n%s\n$divider\n" "[FAIL] $msg"; })
}

output "*" "Building Bitbucket Pipeline Image"
source build.sh