# Get theme related server settings

**URL** : `/api/settings/theme`
**Method** : `GET`


## Success Response
**Code** : `200 OK`
**Content-Type**: `application/json`
**Content example**
```json
{
    "success": true,
    "settings": {
        "darkModePrimary": "#001b3d",
        "darkModeSecondary": "#98a8ae",
        "darkModeText": "#ffffff",
        "darkModeBannerLogo": "https://rair.myfilebase.com/ipfs/QmNRwnvc...",
        "darkModeMobileLogo": "https://ipfs.io/ipfs/QmTAF5...",
        "lightModeBannerLogo": "https://ipfs.io/ipfs/QmX1wx...",
        "lightModeMobileLogo": "https://ipfs.io/ipfs/QmfJq1Dc...",
        "buttonPrimaryColor": "#4b54ce",
        "buttonFadeColor": "#74da72",
        "buttonSecondaryColor": "#1b4b42"
    }
}
```