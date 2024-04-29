#!/usr/bin/env sh
set -eu

# As of version 1.19, the official Nginx Docker image supports templates with
# variable substitution. But that uses `envsubst`, which does not allow for
# defaults for missing variables. Here, first use the regular command shell
# to set the defaults:
export API_HOST=${API_HOST:-http://host.docker.internal:5000/api/}

# Due to `set -u` this would fail if not defined and no default was set above
echo "Will proxy requests for /api/* to ${API_HOST}*"

export MS_HOST=${MS_HOST:-http://host.docker.internal:5002/ms/}
echo "Will proxy requests for /api/* to ${MS_HOST}*"

export API_HOST_STREAM=${API_HOST_STREAM:-http://host.docker.internal:5000/stream/}
echo "Will proxy requests for /api/* to ${API_HOST_STREAM}*"

# Finally, let the original Nginx entry point do its work, passing whatever is
# set for CMD. Use `exec` to replace the current process, to trap any signals
# (like Ctrl+C) that Docker may send it:
exec /docker-entrypoint.sh "$@"