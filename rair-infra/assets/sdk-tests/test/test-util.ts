const Dotenv = require('dotenv');
Dotenv.config();
module.exports = {
  serverURL: process.env.SERVER_URL,
  socketURL: process.env.SOCKET_URL,
  User_Address: process.env.USER_ADDRESS,
  User_NickName: process.env.USER_NICKNAME,
  Contract_Address1: process.env.CONTRACT_ADDRESS1,
  Contract_Id1: process.env.CONTRACT_ID1,
  Product1_Contract1: process.env.PRODUCT1_CONTRACT1,
  Product1_Offer1_Contract1: process.env.PRODUCT1_OFFER1_CONTRACT1,
  Blockchain1: process.env.BLOCKCHAIN1,
  Contract_Address2: process.env.CONTRACT_ADDRESS2,
  Contract_Id2: process.env.CONTRACT_ID2,
  Blockchain2: process.env.BLOCKCHAIN2,
  MediaId1: process.env.MEDIAID1,
  MediaId1_Description: process.env.MEDIAID1_DESCRIPTION,
  Category_Id1: process.env.CATEGORY_ID1,
  TokenId1: process.env.TOKENID1
};
