# Get all tokens for user

Get all tokens numbers by product

**URL** : `/api/v2/tokens/tokenNumbers`

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
**Query parameters** 

```json
{
  "product": {
    "required": true,
    "content": {
      "type": "string" //actually number
    }
  },
  "networkId": {
    "required": false,
    "content": {
      "type": "string"
    }
  },
  "contractAddress": {
    "required": false,
    "content": {
      "type": "string"
    },
  },
  "contract": {
    "required": false,
    "content": {
      "type": "string" // (objectId)
    },
  },
}
```
## Success Response

Returns if found some tokens

**Code** : `200 OK`

**Content-Type**: `application/json;`

**Content example**

```json
{
    "success": true,
    "tokens": [
        1,...
    ]
}
```
