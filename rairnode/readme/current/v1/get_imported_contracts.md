# Import external contract

List all imported contracts by the user

**URL** : `/api/contracts/imported/`

**Method** : `GET`

## Success Response

An array of contracts imported by the user

**Code** : `200 OK`

**Content-Type**: `application/json`

**Content example**

```json
{
  "success": true,
  "contracts": [{...contractSchema}],
}
```