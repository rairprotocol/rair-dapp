// Update external url hosts for all Ukraineglitch tokens
db.MintedToken.find({ "metadata.name": { $regex: /^UkraineGlitch.*/ } }).toArray().forEach(token => {
  const reg = /^https:\/\/localhost/;
  const updatedUrl = token.metadata.external_url.replace(reg, 'https://ukraineglitch.com');

  db.MintedToken.findOneAndUpdate({ _id: token._id }, { $set: { 'metadata.external_url': updatedUrl } });
});
