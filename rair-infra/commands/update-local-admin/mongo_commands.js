PUBLIC_ADDRESS = "VAR_PUBLIC_ADDRESS"
ADMIN_NFT = "VAR_ADMIN_NFT"


//Sets default admin credentials to allow access to rair-db
db = db.getSiblingDB('admin')
db.auth("admin","admin")
db = db.getSiblingDB('rair-db')


//Set SuperAdmin
db.ServerSetting.updateMany({},
    { $push: { "superAdmins" : PUBLIC_ADDRESS } }
)

print("\nExiting Mongo Shell...")
db.logout()
quit()
