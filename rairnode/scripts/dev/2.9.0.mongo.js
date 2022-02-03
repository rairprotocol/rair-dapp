// add additional field to the collection documents
db.MintedToken.find().toArray().forEach(token => {
  const reg = new RegExp(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:\/?#[\]@!\$&'\(\)\*\+,;=.]+$/gm);
  db.MintedToken.findOneAndUpdate({ _id: token._id }, { $set: { isMetadataPined: reg.test(token.metadataURI) } });
});
