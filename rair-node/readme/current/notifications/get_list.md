# List notifications
Uses pagination and filtering, user search is only available to admins

**URL** : `/api/notifications/`
**Method** : `GET`

**Query parameters**
```json
{
    "pageNum": { "required": false, "content": { "type": "number" } },
    "itemsPerPage": { "required": false, "content": { "type": "number" } },
    "user": { "required": false, "content": { "type": "string" } },
    "type": { "required": false, "content": { "type": "string" } },
    "onlyRead": { "required": false, "content": { "type": "boolean" } },
    "onlyUnread": { "required": false, "content": { "type": "boolean" } },
}
```

## Success Response
**Code** : `200 OK`
**Content-Type**: `application/json`
**Content example**
```json
{
  "success": true,
  "totalCount": 90,
  "notifications": [
    {
      "_id": "6657edb4d1f06c7b91e39089",
      "user": "0xec30759d0a3f3ce0a730111dc29d74e441f492c3",
      "type": "message",
      "message": "Logged in as 0xec30759d0a3f3ce0a730111dc29d74e441f492c3",
      "data": [],
      "read": false
    },
    {
      "_id": "6657ee0ed1f06c7b91e390fb",
      "user": "0xec30759d0a3f3ce0a730111dc29d74e441f492c3",
      "type": "message",
      "message": "Uploaded video Office Stock Footage - Having A Team Meeting _ Working As A Group -  Business Footage Free Download (2160p_25fps_VP9 LQ-160kbit_Opus).webm",
      "data": [
        "10"
      ],
      "read": false
    },
    {
      "_id": "6657e707b9aa9346237c1696",
      "user": "0xec30759d0a3f3ce0a730111dc29d74e441f492c3",
      "type": "message",
      "message": "Logged in as 0xec30759d0a3f3ce0a730111dc29d74e441f492c3",
      "data": [],
      "read": false
    },
    {
      "_id": "6657e7b2648de0d1423cc7ca",
      "user": "0xec30759d0a3f3ce0a730111dc29d74e441f492c3",
      "type": "message",
      "message": "Uploaded video Office Stock Footage - Having A Team Meeting _ Working As A Group -  Business Footage Free Download (2160p_25fps_VP9 LQ-160kbit_Opus).webm",
      "data": [
        "10"
      ],
      "read": false
    },
    {
      "_id": "6657e71fb9aa9346237c1706",
      "user": "0xec30759d0a3f3ce0a730111dc29d74e441f492c3",
      "type": "message",
      "message": "Uploaded video Office Stock Footage - Having A Team Meeting _ Working As A Group -  Business Footage Free Download (2160p_25fps_VP9 LQ-160kbit_Opus).webm",
      "data": [
        "10"
      ],
      "read": false
    },
    {
      "_id": "6657e6abb9aa9346237c1534",
      "user": "0xec30759d0a3f3ce0a730111dc29d74e441f492c3",
      "type": "message",
      "message": "Logged in as 0xec30759d0a3f3ce0a730111dc29d74e441f492c3",
      "data": [],
      "read": false
    },
    {
      "_id": "6657d998485fd368b7d99884",
      "user": "0xec30759d0a3f3ce0a730111dc29d74e441f492c3",
      "type": "message",
      "message": "Uploaded video Office Stock Footage - Having A Team Meeting _ Working As A Group -  Business Footage Free Download (2160p_25fps_VP9 LQ-160kbit_Opus).webm",
      "data": [
        "10"
      ],
      "read": false
    },
    {
      "_id": "6657d97f485fd368b7d99828",
      "user": "0xec30759d0a3f3ce0a730111dc29d74e441f492c3",
      "type": "message",
      "message": "Logged in as 0xec30759d0a3f3ce0a730111dc29d74e441f492c3",
      "data": [],
      "read": false
    },
    {
      "_id": "6657e64cb9aa9346237c136e",
      "user": "0xec30759d0a3f3ce0a730111dc29d74e441f492c3",
      "type": "message",
      "message": "Uploaded video Office Stock Footage - Having A Team Meeting _ Working As A Group -  Business Footage Free Download (2160p_25fps_VP9 LQ-160kbit_Opus).webm",
      "data": [
        "10"
      ],
      "read": false
    },
    {
      "_id": "6657e79a648de0d1423cc75a",
      "user": "0xec30759d0a3f3ce0a730111dc29d74e441f492c3",
      "type": "message",
      "message": "Logged in as 0xec30759d0a3f3ce0a730111dc29d74e441f492c3",
      "data": [],
      "read": false
    }
  ]
}
```