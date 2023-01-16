# Import external contract

Loads all of the information about the NFTs of a contract
NOTE: if limit is less than moralis page size at least 1 page will be imported

**URL** : `/api/v2/contracts/import/`

**Method** : `POST`

**Parameters:**

- none

**Requset body**
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
  },
  "limit": {
    "description": "Limit of tokens to import",
    "type": "string",
    "required": true
  }
}
```
Example:
```json
{
    "networkId": "0x13881",
    "contractAddress": "0x000000000example4343d5fe518757dbc1dd7460",
    "limit": 10
}
```
## Success Response

If the user has admin access, NFTs will get slowly imported in groups of 100 (This is a limit by Moralis)
Once the number of NFTs imported is greater than the limit, it will stop.

**Code** : `200 OK`

**Content-Type**: `application/json`

**Content example**

```json
{
  "success": true,
  "result": {
    "contract": {...contractSchema},
    "numberOfTokensAdded": 100
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

**Condition** : None of the tokens have metadata, so there's no point storing the data

**Code** : `500 INTERNAL SERVER ERROR`

**Content** :

```json
{
  "success": false,
  "result": undefined,
  "message": "Of the XX tokens inserted, none of them had metadata!"
}
```

OR 

**Condition** : Retried too many times to get information

**Code** : `500 INTERNAL SERVER ERROR`

**Content** :

```json
{
  "success": false,
  "result": undefined,
  "message": "Aborted import of contract 0x..., request for page XXX failed too many times`
}
```