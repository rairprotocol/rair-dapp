# Get all tokens for user

Get all tokens which belongs to current user

**URL** : `/api/v2/tokens/my`

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

Applies common get all logic, owner address is fixed to current user [details](./common_get_all.md)

## Success Response

Returns if found some tokens

**Code** : `200 OK`

**Content-Type**: `application/json;`

**Content example**

```json
{
    "success": true,
    "results": 36,
    "data": {
        "doc": [
            {
                "metadataURI": "none",
                "authenticityLink": "none",
                "isURIStoredToBlockchain": false,
                "_id": "62a86acbace598001dbf1283",
                "contract": "629f308eb550f7001d6ee2cf",
                "token": "18",
                "offerPool": "84",
                "ownerAddress": "0x2c1b196a2ef816d3ff5c68f22722cc49ea058a42",
                "offer": "0",
                "uniqueIndexInContract": "18",
                "isMinted": false,
                "metadata": {
                    "image": "ipfshash",
                    "artist": "Test Mike Artist",
                    "external_url": "https:///629f308eb550f7001d6ee2cf/0/0/18",
                    "description": "Example description",
                    "name": "Test Sample 19",
                    "attributes": [
                        {
                            "trait_type": "Property 1",
                            "value": "green"
                        },
                       ...
                        
                    ],
                    "animation_url": "ipfshash"
                },
                "isMetadataPinned": false,
                "creationDate": "2022-06-14T11:02:35.741Z"
            },
            ...
        ]
    }
}
```
