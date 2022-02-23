const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const app = express();
const fs = require('fs')
const IPFS = require('ipfs')

app.set('view engine', 'jade');

let origin = `https://${ process.env.SERVICE_HOST }`;

app.use(cors({ origin }));
app.use(fileUpload());
app.use('/public', express.static(__dirname + '/public'));

var ipfsAPI = require('ipfs-api')
var ipfsNode = ipfsAPI('localhost', '5001', {protocol: 'http'})

app.post('/upload', (req, res, next) => {
  console.log(req);
  let imageFile = req.files.file;
  let filename = `${__dirname}/public/${req.body.filename}`

  imageFile.mv(`${__dirname}/public/${req.body.filename}`, function(err) {
      if (err) {
      return res.status(500).send(err);
    }
      ipfsNode.files.add({
        path: req.body.filename,
        content: fs.createReadStream(filename)
      }, function(err, ipfsFile) {
      if (!err) {
        let newFilename = `${__dirname}/public/${ipfsFile[0].hash}`
        fs.rename(filename, newFilename, function(err) {

          let data = {
            name: req.body.filename,
            description: req.body.filename,
            image: `http://localhost:8080/ipfs/${ipfsFile[0].hash}`
          }

          let metadataFilename = `${__dirname}/public/${req.body.filename}.json`
          fs.writeFile(metadataFilename, JSON.stringify(data), "utf8", function(err) {
            if (err) {
              console.log("couldn't save the playlist file to playlist directory")
            } else {
              ipfsNode.files.add({
                path: `${req.body.filename}.json`,
                content: fs.createReadStream(metadataFilename)
              },function(err, ipfsMetadataFile) {
                res.json({
                  file: `public/${ipfsFile[0].hash}`,
                  metadata: `http://localhost:8080/ipfs/${ipfsMetadataFile[0].hash}`,
                  ipfsHash: ipfsFile[0].hash
                })
              })
            }
          })
        });
      } else {
        console.log(err)
      }
    })

    // res.json({file: `public/${req.body.filename}.jpg`});
  });

})

app.listen(3000, () => {
  console.log('3000');
});

module.exports = app;
