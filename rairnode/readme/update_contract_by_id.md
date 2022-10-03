# Update User

Updating specific contract only with superAdmin right

**URL** : `/api/v2/contracts/:contractId`

**Method** : `PATCH`

**Content-Type** : `application/json;`

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

**Parameters:**

```json
{
  "contractId": {
    "required": true,
    "content": {
      "type": "string"
    }
  }
}
```

**Requset body**

```json
{
  "blockSynck": {
    "required": false,
    "content": {
      "type": "boolean"
    }
  },
  "blockSynck": {
    "required": false,
    "content": {
      "type": "boolean"
    }
  },
}
```

## Success Response

Returns if updated successfully

**Code** : `200 OK`

**Content-Type**: `application/json;`

**Content example**

```json
{
    "success": true,
    "data": {
        "doc": {
            "diamond": false,
            "lastSyncedBlock": "7567675",
            "external": false,
            "singleMetadata": false,
            "metadataURI": "none",
            "blockSync": false,
            "blockView": false,
            "_id": "629f26057734.....",
            "transactionHash": "0x1d8804d6ca5fb5be93a105e1815b31ef2ea9deb247d4b6......",
            "title": "Test title",
            "user": "0x761ee23cf803acd929e2312323......",
            "blockchain": "0x5",
            "contractAddress": "0x8a3ce0ec211dd7dcd8393015.....",
            "creationDate": "2022-06-07T10:18:45.242Z"
        }
    }
}
```