#!/usr/bin/env bash

# dependency_sync_check - init.sh
# Written by Zeph
# May 2022

# This preliminary script checks the current git commit and creates a list 
# of file paths relating to any file in the commit named package.json or yarn.lock 
# It then iterates through the list and executes main.sh on each one
# Until either the entire list has been exhausted, or an error is thrown. 

DIR=$(dirname $0)
divider="###############################################################"

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
        ([ "$type" = "!" ] && { printf "\n$divider\n%s\n$divider\n" "[FAIL] $msg"; \
        [ -a $DIR/yarn.lock ] && rm $DIR/yarn.lock; })
}

output "*" "Initializing..."

#######
#SETUP#
#######

# Creates a list of all committed files based on the git commit id provided
# by $BITBUCKET_COMMIT and tosses any that are not named package.json or yarn.lock.
# Checks for package.json first then yarn.lock if unsuccessful

list=$(git diff-tree --no-commit-id --name-only -r $BITBUCKET_COMMIT | grep package.json) || \
    list=$(git diff-tree --no-commit-id --name-only -r $BITBUCKET_COMMIT | grep yarn.lock) 

output "*" "${#list[@]} dependency file(s) detected in this commit." && echo $list

# Iterates through list of files. Yanks the filename before passing
# the path to the main.sh

for ((i = 0; i < ${#list[*]}; ++i))
    do
        output "*" "Executing dependency check step $(($i+1)) of ${#list[*]}"
        source $DIR/main.sh $(echo "$(dirname ${list[$i]})"/"")
        output "*" "PASSED!" 
        rm $DIR/yarn.lock
    done