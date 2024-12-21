#!/bin/bash

echo "RUN TSC ON MINTER MARKETPLACE"

DIR=$(dirname $0)

# run typescript using the version installed
# in node_modules as a dev dependency

npx tsc -p $DIR/../