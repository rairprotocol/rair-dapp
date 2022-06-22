# Create a batch of tokens with common metadata for contract or product

Create a batch of tokens with common metadata for contract or product

**URL** : `/api/v2/tokens`

**Method** : `POST`

**Content-Type** : `multipart/form-data`

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

**Request body:**

```json
{
  "files": {
    "required": false,
    "content": {
      "type": "array",
      "items": {
        "type": "file"
      }
    }
  },
  "contract": {
    "required": true,
    "content": {
      "type": "string"
    }
  },
  "commonMetadataFor": {
    "required": true,
    "content": {
      "type": "string",
      "variants": ["contract", "product"]
    }
  },
  "product": {
    "required": false,
    "content": {
      "type": "string"
    }
  },
  "name": {
    "required": false,
    "content": {
      "type": "string"
    }
  },
  "description": {
    "required": false,
    "content": {
      "type": "string"
    }
  },
  "artist": {
    "required": false,
    "content": {
      "type": "string"
    },
    "description": "contract ID"
  },
  "external_url": {
    "required": false,
    "content": {
      "type": "URI"
    }
  },
  "image": {
    "required": false,
    "content": {
      "type": "full name of file"
    }
  },
  "animation_url": {
    "required": false,
    "content": {
      "type": "full name of file"
    }
  },
  "attributes": {
    "required": false,
    "content": {
      "type": "array",
      "items": {
        "type": "object",
        "fields": {
          "trait_type": {
            "type": "string"
          },
          "value": {
            "type": "string"
          }
        }
      }
    }
  }
}
```

## Success Response

Returns if updated successfully

**Code** : `200 OK`

**Content-Type**: `application/json;`

**Content example**

```json
{
  "success": true
}
```
