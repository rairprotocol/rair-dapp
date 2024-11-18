class Locator(object):

    private_key_locator = "//*[@id='root']/div/div/div/input"
    private_key_locator_new = "//div[@id='root']/div/div[2]/div[3]/div/div/div/input"
    private_key = "902724d51d109a26cad6f7c4c18599cee5366ffb718b80a06c42a5a4c315b0c2"
    public_key = "0x980df6193829384539781f1075316b7913c88bec"
    #public_key = "0x67b99531a2ab44f5c71474bd54d07fe78d7c5516"
    #private_key = "8ca0ef84077c6fec75e34067aa498ea95f57c8979d0701f506b004ef5472b7de"
    #private_key = "edb857db1f3d0106ec384263a572358e5490eaf295675f78857d89c6077937d8"

    ################################################
    # Select Blockchain - Binance Testnet
    Binance = "//*[@id='root']/div/div/div/div[4]/button[1]"
    #Binance_new = "connect_BNB"
    Binance_new = "//button[contains(.,'Binance Testnet')]"
    # Select Blockchain - Klaytn Testnet
    klaytn_new = "connect_KLAY"
    # Select Blockchain - Mumbai Testnet
    Mumbai = "//*[@id='root']/div/div/div/div[4]/button[3]"
    Mumbai_Testnet_new = "//button[contains(.,'Matic Testnet Mumbai')]"
    # Select Blockchain - Mainnet Matic
    Mumbai_Main_new = "connect_MATIC"
    #################################################

    #connect_wallet = "//button[contains(.,'Connect Wallet')]"
    connect_wallet = "//button[contains(.,'Connect')]"
    profile_dropdown_beta = "//div[@id='root']/div/div/div[1]/div[3]/div/div[2]/div[1]/div[3]/button/div[2]/i"
    #profile_dropdown = "//div[@id='root']/div/div/div/div[2]/div[3]/div/div[2]/div/div[2]/button/div[4]/i"
    profile_dropdown = "//*[@class='svg-inline--fa fa-bars icon-menu']"
    #profile_dropdown = "//*[@class='icon-menu fas fa-bars']"
    profile_dropdown_hotdrops = "//*[@class='icon-menu fas fa-bars hotdrops-btn']"

    Contract_Heading = "//h3[contains(.,'Your Deployed ERC721 Contracts')]"
    Marketplace_Heading = "xpath=//h5[contains(.,'Minter Marketplace')]"

    #####################################################

    admin_icon = "//div[@id='root']/div/div/div/div[3]/div/div/i"
    #menu_admin = "//*[@id='root']/div/div[2]/div[2]/div[6]/a"
    menu_admin = "fa-user-secret"
    #menu_factory = "//*[@id='root']/div/div/div[2]/div[1]/div[2]/a[11]"
    #menu_factory = "//a[contains(text(),'Factory')]"
    menu_factory = "fa-city"
    #menu_MyNFTs = "//a[contains(text(),'My NFTs')]"
    menu_MyNFTs = "fa-key"
    #menu_MyContracts = "//a[contains(text(),'My Contracts')]"
    menu_MyContracts = "fa-id-card"
    #menu_ForSale = "//a[contains(text(),'For Sale')]"
    menu_ForSale = "fa-shopping-cart"
    #menu_Marketplace = "//*[@id='root']/div/div/div[2]/div[1]/div[2]/a[12]"
    #menu_Marketplace = "//a[contains(text(),'Minter Marketplace')]"
    menu_Marketplace = "fa-shopping-basket"
    menu_DiamondMarketplace = "fa-gem"
    menu_TransferNFT = "fa-exchange"
    menu_Import = "fa-file-import"


    text_policy = "policy"
    text_use  = "use"

    ###################################################


    Metamask_icon = "//*[@id='root']/div/div/div[2]/div[1]/button"

    #Contract_name_textbox_new = "//*[@id='root']/div/div/div[2]/div[2]/div[2]/div/div[2]/input"
    Contract_name_textbox_new = "//*[@id='root']/div/div/div[3]/div[2]/div/div[2]/input"
    ContractName_textbox_creatorUI = "//div[@id='root']/div/div/div[3]/div[2]/div/div/div[2]/div[2]/div[3]/input"
    ContractAdd_button_creatorUI = "//button[contains(.,'Deploy using 15.0 RAIR Tokens')]"
    ContractAdd_Diamond_button_creatorUI = "//button[contains(.,'deploy with Diamonds')]"
    CollectionName_textbox_creatorUI = "//div[@id='root']/div/div/div[3]/div[2]/div/div/div[2]/div[2]/div/input"
    Collection_Length_creatorUI = "//div[@id='root']/div/div/div[3]/div[2]/div/div/div[2]/div[2]/div[2]/input"
    CollectionAdd_button_creatorUI = "//button[contains(.,'Create collection!')]"
    Collection_Add_switch_creatorUI = "//div[@id='root']/div/div/div[3]/div[2]/div/div[3]/div/div[3]/div/button"
    MinterMarketplace_button_creatorUI = "//button[contains(.,'Approve Minter Marketplace')]"
    DiamondMarketplaceApprove_button_creatorUI = "//button[contains(.,'Approve the marketplace as a Minter!')]"
    Diamond_RangesSale_button_creatorUI = "//button[contains(.,'Put selected ranges up for sale!')]"
    #AddOffer_Button_creatorUI = "//div[@id='root']/div/div[2]/div[2]/div[2]/div[2]/div/div/button/i"
    AddOffer_Button_creatorUI = "//button[contains(.,'Add new')]"
    OfferName_textbox_creatorUI = "//div[@id='root']/div/div/div[3]/div[2]/div[2]/table/tbody/tr/th[2]/div/input"
    OfferName_Diamond_textbox_creatorUI = "//div[@id='root']/div/div/div[3]/div[2]/div[2]/div/div/div/div/div/input"
    #OfferName_Diamond_textbox_creatorUI = "//div[@id='root']/div/div[2]/div[2]/div[2]/div[2]/div/div/div/div/div/input"
    #OfferName_Endtoken_creatorUI = "//div[@id='root']/div/div[2]/div[2]/div[2]/div[2]/table/tbody/tr/th[4]/div/input"
    OfferName_Endtoken_creatorUI = "//div[@id='root']/div/div/div[3]/div[2]/div[2]/table/tbody/tr/th[4]/div/input"
    #OfferName_Diamond_Endtoken_creatorUI = "//div[@id='root']/div/div[2]/div[2]/div[2]/div[2]/div/div/div/div[4]/div/input"
    OfferName_Diamond_Endtoken_creatorUI = "//div[@id='root']/div/div/div[3]/div[2]/div[2]/div/div/div/div[4]/div/input"
    #OfferName_Price_creatorUI = "//div[@id='root']/div/div[2]/div[2]/div[2]/div[2]/table/tbody/tr/th[5]/div/input"
    OfferName_Price_creatorUI = "//div[@id='root']/div/div/div[3]/div[2]/div[2]/table/tbody/tr/th[5]/div/input"
    #OfferName_Diamond_Price_creatorUI = "//div[@id='root']/div/div[2]/div[2]/div[2]/div[2]/div/div/div/div[5]/div/input"
    OfferName_Diamond_Price_creatorUI = "//div[@id='root']/div/div/div[3]/div[2]/div[2]/div/div/div/div[5]/div/input"
    OfferName_delete_icon = "//div[@id='root']/div/div[2]/div[2]/div[2]/div[2]/table/tbody/tr/th[5]/div/input"
    AddOfferConfirm_Button_creatorUI = "//button[contains(.,'offer')]"
    AddOfferConfirm_Diamond_Button_creatorUI = "//button[contains(.,'Ranges')]"
    #Contract_add_button_new = "//*[@id='root']/div/div/div[2]/div[2]/div[2]/div/div[2]/button[2]"
    #Contract_add_button_new = "//*[@id='root']/div/div/div[3]/div[2]/div/div[2]/button[2]"
    Contract_add_button_new = "//button[contains(.,'Buy an ERC721 contract for')]"
    Continue_button_creatorUI = "//button[contains(.,'Continue')]"
