PUBLIC_ADDRESS = "VAR_PUBLIC_ADDRESS"
ADMIN_NFT = "VAR_ADMIN_NFT"

//Sets default admin credentials to allow access to rair-db
db = db.getSiblingDB('admin')
db.auth("admin","admin")
db = db.getSiblingDB('rair-db')

db.User.updateOne(
    { "publicAddress" : PUBLIC_ADDRESS },
    { $set: { "adminNFT" : ADMIN_NFT } }
)

user = db.User.findOne({publicAddress:PUBLIC_ADDRESS})
admin_NFT  = user.adminNFT.toString()

print("\nChanging adminNFT to", admin_NFT)

print("\nExiting Mongo Shell...")
db.logout()
quit()