# Verify User

Verify userAdmin

**URL** : `/api/v2/verify`

**Method** : `GET`

**Headers:**

```json
{
  "x-rair-token": {
    "required": true,
    "content": {
      "type": "string"
    }
  }
}
```
## Success Response

Returns verify userAdmin

**Code** : `200 OK`

**Content-Type**: `application/json;`

**Content example**

```json

{
"email": "user email",
"avatar": null,
"firstName": null,
"lastName": null,
"_id": "6295e23d279c31001d009d18",
"publicAddress": "some public address",
"adminNFT": "some NFT",
"creationDate": "2022-05-31T09:39:09.152Z",
"nickName": null,
"adminRights": true
}
