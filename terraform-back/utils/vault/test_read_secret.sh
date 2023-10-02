#!/bin/bash

DIR=$(dirname "$0")

source $DIR/before_script.sh

SECRET_TO_READ="primary/test"
vault kv get $SECRET_TO_READ

source $DIR/unset.sh