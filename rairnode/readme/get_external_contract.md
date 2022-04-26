# Get token

Respond to a challenge to receive a JWT

**URL** : `/api/contracts/import/network/:networkId/:contractAddress/`

**Method** : `GET`

**Parameters:**

```json
{
  "networkId": {
    "description": "The blockchain where the external contract is located,",
    "type": "string",
    "required": true
  },
  "contractAddress": {
    "description": "The address of the external contract",
    "type": "string",
    "required": true
  }
}
```

## Success Response

If the user has admin access, NFTs will get imported in pages of 500 (This is a limit by Moralis)

**Code** : `200 OK`

**Content-Type**: `application/json`

**Content example**

```json
{
  "success": true,
  "result": {
    "contract": {...contractSchema},
    "numberOfTokensAdded": 500
  },
  "message": undefined
}
```

## Error Response

**Condition** : If an error happens in the middle of the import.

**Code** : `500 INTERNAL SERVER ERROR`

**Content** :

```json
{
  "success": false,
  "result": undefined,
  "message": "There was a problem importing the tokens!"
}
```

OR

**Condition** : None of the tokens have metadata, making their insertion useless

**Code** : `500 INTERNAL SERVER ERROR`

**Content** :

```json
{
  "success": false,
  "result": undefined,
  "message": "Of the XX tokens inserted, none of them had metadata!"
}
```