# Set the product's banner
Image uploaded through the IPFS service

**URL** : `/api/products/`
**Method** : `POST`

**Body Parameters**
```json
{
    "banner": { "required": true, "content": { "type": "file" } },
}
```

## Success Response
**Code** : `200 OK`
**Content-Type**: `application/json`
**Content example**
```json
{
    "success": true,
    "bannerURL": "https://ipfs.io/ipfs/QmQoNnw5U..."
}
```