
DIR=$(dirname "$0")

echo "Generate short lived token for vault kv test"

source $DIR/before_script.sh

APP_ROLE="auth/approle/role/test-role"

ROLE_ID=$(vault read $APP_ROLE/role-id | jq .data.role_id --raw-output)

SECRET_ID=$(vault write -f $APP_ROLE/secret-id | jq .data.secret_id --raw-output)

vault write "auth/approle/login" \
  role_id=$ROLE_ID \
  secret_id=$SECRET_ID

source $DIR/unset.sh