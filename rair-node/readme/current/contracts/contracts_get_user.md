# Get contracts by the current user

**URL** : `/api/contracts/my`
**Method** : `GET`

**Query parameters**
```json
{
    "pageNum": { "required": false, "content": { "type": "number" } },
    "itemsPerPage": { "required": false, "content": { "type": "number" } },
    "title": { "required": false, "content": { "type": "string" } },
    "user": { "required": false, "content": { "type": "string" } },
    "blockchain": { "required": false, "content": { "type": "string" } },
    "contractAddress": { "required": false, "content": { "type": "string" } },
    "diamond": { "required": false, "content": { "type": "string" } },
    "creationDate": { "required": false, "content": { "type": "string" } },
    "transactionHash": { "required": false, "content": { "type": "string" } },
    "lastSyncedBlock": { "required": false, "content": { "type": "string" } },
    "external": { "required": false, "content": { "type": "boolean" } },
    "singleMetadata": { "required": false, "content": { "type": "boolean" } },
    "metadataURI": { "required": false, "content": { "type": "string" } },
    "importedBy": { "required": false, "content": { "type": "string" } },
    "blockSync": { "required": false, "content": { "type": "boolean" } },
    "blockView": { "required": false, "content": { "type": "boolean" } },
}
```

## Success Response
**Code** : `200 OK`
**Content-Type**: `application/json`
**Content example**
```json
{
    "success": true,
    "result": [
        {
            "_id": "64ff3c18d16d1deee0ff12f2",
            "blockchain": "0x5",
            "contractAddress": "0xbcd6b6751cf9adb07b74e056adef5e9cb4b8ef27",
            "blockSync": true,
            "blockView": false,
            "creationDate": "2023-09-11T16:11:04.422Z",
            "diamond": false,
            "external": false,
            "importedBy": "",
            "lastSyncedBlock": "0",
            "metadataURI": "none",
            "singleMetadata": false
        },
        {
            "_id": "64ff3c18d16d1deee0ff12f4",
            "blockchain": "0x13881",
            "contractAddress": "0xa011723657362e28325e26f5ccec517a920bbb43",
            "blockSync": true,
            "blockView": false,
            "creationDate": "2023-09-11T16:11:04.424Z",
            "diamond": false,
            "external": false,
            "importedBy": "",
            "lastSyncedBlock": "0",
            "metadataURI": "none",
            "singleMetadata": false
        },
        {
            "_id": "64ff3f5757d24b6bb5e45009",
            "title": "suresh-Matic_2403",
            "user": "0x67b99531a2ab44f5c71474bd54d07fe78d7c5516",
            "blockchain": "0x13881",
            "contractAddress": "0xfd9ea47ae7dad66f4343d5fe518757dbc1dd7460",
            "diamond": false,
            "transactionHash": "0xb9db8e19c5bcb1eb14733a3d1a8e989b8da41f39e3cbd80689e16d1004ce3daa",
            "lastSyncedBlock": "26347558",
            "external": false,
            "singleMetadata": false,
            "metadataURI": "none",
            "importedBy": "",
            "blockSync": false,
            "blockView": false,
            "creationDate": "2023-09-11T16:24:55.175Z"
        },
        {
            "_id": "64ff3f5757d24b6bb5e4500c",
            "title": "suresh-Matic_1204",
            "user": "0x67b99531a2ab44f5c71474bd54d07fe78d7c5516",
            "blockchain": "0x13881",
            "contractAddress": "0xb479b76a4356e290379bb0610d196b4cd6ab8458",
            "diamond": false,
            "transactionHash": "0xb9db8e19c5bcb1eb14733a3d1a8e989b8da41f39e3cbd80689e16d1004ce3daa",
            "lastSyncedBlock": "25905690",
            "external": false,
            "singleMetadata": false,
            "metadataURI": "none",
            "importedBy": "",
            "blockSync": false,
            "blockView": false,
            "creationDate": "2023-09-11T16:24:55.181Z"
        },
        {
            "_id": "64ff3f5757d24b6bb5e4500f",
            "title": "suresh-Matic_1204_2",
            "user": "0x67b99531a2ab44f5c71474bd54d07fe78d7c5516",
            "blockchain": "0x13881",
            "contractAddress": "0xe91d0329a13944cbf7c2342d7805cd9a93bf0e51",
            "diamond": false,
            "transactionHash": "0xb9db8e19c5bcb1eb14733a3d1a8e989b8da41f39e3cbd80689e16d1004ce3daa",
            "lastSyncedBlock": "27973956",
            "external": false,
            "singleMetadata": false,
            "metadataURI": "none",
            "importedBy": "",
            "blockSync": false,
            "blockView": false,
            "creationDate": "2023-09-11T16:24:55.184Z"
        },
        {
            "_id": "64ff3f5757d24b6bb5e45012",
            "title": "suresh-Matic-1204_3",
            "user": "0x67b99531a2ab44f5c71474bd54d07fe78d7c5516",
            "blockchain": "0x13881",
            "contractAddress": "0x296e0b259cf77e151bb87028a680a642ddf0f70f",
            "diamond": false,
            "transactionHash": "0xb9db8e19c5bcb1eb14733a3d1a8e989b8da41f39e3cbd80689e16d1004ce3daa",
            "lastSyncedBlock": "27975391",
            "external": false,
            "singleMetadata": false,
            "metadataURI": "none",
            "importedBy": "",
            "blockSync": false,
            "blockView": false,
            "creationDate": "2023-09-11T16:24:55.186Z"
        },
        {
            "_id": "64ff3f5757d24b6bb5e45015",
            "title": "suresh-Matic-1304_1",
            "user": "0x67b99531a2ab44f5c71474bd54d07fe78d7c5516",
            "blockchain": "0x13881",
            "contractAddress": "0x482d432c852aa9c463a19342fd2f8ffbba76a03c",
            "diamond": false,
            "transactionHash": "0xb9db8e19c5bcb1eb14733a3d1a8e989b8da41f39e3cbd80689e16d1004ce3daa",
            "lastSyncedBlock": "25919538",
            "external": false,
            "singleMetadata": false,
            "metadataURI": "none",
            "importedBy": "",
            "blockSync": false,
            "blockView": false,
            "creationDate": "2023-09-11T16:24:55.189Z"
        },
        {
            "_id": "64ff3f5757d24b6bb5e45018",
            "title": "suresh-MaticT-2504_1",
            "user": "0x67b99531a2ab44f5c71474bd54d07fe78d7c5516",
            "blockchain": "0x13881",
            "contractAddress": "0x6aedca95484f382a3111e671312b80d1bb5dda29",
            "diamond": false,
            "transactionHash": "0xb9db8e19c5bcb1eb14733a3d1a8e989b8da41f39e3cbd80689e16d1004ce3daa",
            "lastSyncedBlock": "26129003",
            "external": false,
            "singleMetadata": false,
            "metadataURI": "none",
            "importedBy": "",
            "blockSync": false,
            "blockView": false,
            "creationDate": "2023-09-11T16:24:55.191Z"
        },
        {
            "_id": "64ff3f5757d24b6bb5e4501b",
            "title": "suresh-tMatic_2604-1",
            "user": "0x67b99531a2ab44f5c71474bd54d07fe78d7c5516",
            "blockchain": "0x13881",
            "contractAddress": "0xec68eb810586a74fd2f8c395602d1ac7c5a2dbe5",
            "diamond": false,
            "transactionHash": "0xb9db8e19c5bcb1eb14733a3d1a8e989b8da41f39e3cbd80689e16d1004ce3daa",
            "lastSyncedBlock": "26092005",
            "external": false,
            "singleMetadata": false,
            "metadataURI": "none",
            "importedBy": "",
            "blockSync": false,
            "blockView": false,
            "creationDate": "2023-09-11T16:24:55.193Z"
        },
        {
            "_id": "64ff3f5757d24b6bb5e4501e",
            "title": "suresh-Matic-110522_1",
            "user": "0x67b99531a2ab44f5c71474bd54d07fe78d7c5516",
            "blockchain": "0x13881",
            "contractAddress": "0x32d0f08644ef2af5067ebf07a793950492c1462c",
            "diamond": false,
            "transactionHash": "0xb9db8e19c5bcb1eb14733a3d1a8e989b8da41f39e3cbd80689e16d1004ce3daa",
            "lastSyncedBlock": "26308720",
            "external": false,
            "singleMetadata": false,
            "metadataURI": "none",
            "importedBy": "",
            "blockSync": false,
            "blockView": false,
            "creationDate": "2023-09-11T16:24:55.194Z"
        }
    ],
    "totalCount": 593
}
```