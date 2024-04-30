#!/usr/bin/env bash

# init.sh for frontend_build_success_pipeline.sh 
# Written by Zeph
# June 2022

#########
# Setup #
#########

divider="-----------------------------------------------"

DIR=$(dirname $0) 
SCRIPTNAME="frontend_build_success_pipeline.sh"
SCRIPTPATH="$DIR/$SCRIPTNAME" 

########
#OUTPUT#
########

# Automatically formats general and error messages based on key string 
# ("*" for general output and "!" for errors) passed before the actual 
# message string

function output {
    type=$1 # "*" for general output and "!" for errors
    msg=$2
    ([ "$type" = "*" ] && printf "\n$divider\n%s\n$divider\n" "[*] $msg") || \
        ([ "$type" = "!" ] && { printf "\n$divider\n%s\n$divider\n" "[FAIL] $msg"; })
}

######
#Main#
######

source $SCRIPTPATH
exitStatus=$?

[[ $exitStatus -eq 0 ]] && \
  { output "*" "[SUCCESS] Minting-Network Image built. No errors detected."; exit 0;} || \
  { output "!" "A local error is causing a build failure. Please locate and address the issue before the next PR."; exit 1; }