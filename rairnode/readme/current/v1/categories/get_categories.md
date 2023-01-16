# Get categories

List of all categories

**URL** : `/api/categories`

**Method** : `GET`

## Success Response

Returns a list of categories

**Code** : `200 OK`

**Content-Type**: `application/json`

**Content example**

```json
{
  "success": true,
  "categories": [
    {
      "_id": "61b21ab159492e001cfc35ac",
      "name": "Music"
    },
    {
      "_id": "61b21ab159492e001cfc35ad",
      "name": "Art"
    },
    {
      "_id": "61b21ab159492e001cfc35ae",
      "name": "Conference"
    },
    {
      "_id": "61b21ab159492e001cfc35af",
      "name": "Science"
    }
  ]
}
```
