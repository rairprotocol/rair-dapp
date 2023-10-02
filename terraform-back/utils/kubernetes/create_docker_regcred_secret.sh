#!/bin/bash

DIR=$(dirname "$0")

kubectl apply -f $DIR/secrets/secret.yml