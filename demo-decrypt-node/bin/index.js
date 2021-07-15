const port = process.env.PORT

const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const low = require('lowdb')
const FileAsync = require('lowdb/adapters/FileAsync')
const StartHLS = require('./hls-starter.js')
const fs = require('fs')
const cors = require('cors');
const mongoose = require('mongoose');
const Socket = require("socket.io")
const { newContract, newMinterCollection, rairMintingInfo } = require('./integrations/ethers');
require('dotenv').config()

async function main () {
  const adapter = new FileAsync('./db/store.json')
  const db = await low(adapter)
  const mediaDirectories = ['./bin/Videos', './bin/Videos/Thumbnails']

  for (const folder of mediaDirectories) {
    if (!fs.existsSync(folder)) {
      console.log(folder, "doesn't exist, creating it now!")
      fs.mkdirSync(folder)
    }
  }

  db.defaults({ mediaConfig: {} })
    .write()
  db.defaults({ adminNFT: '' })
    .write()

  const _mongoose = await mongoose.connect(process.env.PRODUCTION === 'true' ? process.env.MONGO_URI : process.env.MONGO_URI_LOCAL, { useNewUrlParser: true, useUnifiedTopology: true })
   .then((c) => {
     if (process.env.PRODUCTION === 'true') {
      console.log('DB Connected!');
     } else {
       console.log('Development DB Connected!');
     }
     return c;
   })
    .catch((e) => {
      console.log('DB Not Connected!');
      console.log(`Reason: ${e.message}`);
    });

  mongoose.set('useFindAndModify', false);

  const app = express()

  /* CORS */
  app.use(cors());

  const hls = await StartHLS();

  const context = {
    hls,
    store: {
      setAdminToken: (token) => {
        return db.set('adminNFT', token).write()
      },
      getAdminToken: () => {
        return db.get('adminNFT').value()
      },
      getMediaConfig: mediaId => {
        return db.get(['mediaConfig', mediaId]).value()
      },
      addMedia: (mediaId, config) => {
        return db.set(['mediaConfig', mediaId], config).write()
      },
      removeMedia: mediaId => {
        return db.unset(['mediaConfig', mediaId]).write()
      },
      listMedia: () => {
        return db.get('mediaConfig').value()
      }
    },
    db: {
      Contract: _mongoose.model('Contract', require('./models/contract'), 'Contract'),
      File: _mongoose.model('File', require('./models/file'), 'File'),
      User: _mongoose.model('User', require('./models/user'), 'User')
    }
  }

  app.use(bodyParser.raw())
  app.use(bodyParser.json())
  app.use('/thumbnails', express.static(path.join(__dirname, 'Videos/Thumbnails')))
  app.use('/stream', require('./routes/stream')(context))
  app.use('/api', require('./routes')(context))
  app.use(express.static(path.join(__dirname, 'public')))
  app.use(function (error, req, res, next) {
    console.error(error)
    res.status(500).json({ success: false, error: true, message: error.message })
  })

  const server = app.listen(port, () => {
    console.log(`Decrypt node listening at http://localhost:${port}`)
  })

  const io = Socket(server);
  const sockets = {};

  io.on("connection", socket => {
    console.log(`Client connected: ${socket.id}`);
    socket.on("init", sessionId => {

      console.log(`Opened connection: ${ sessionId }`);

      sockets[sessionId] = socket.id;
      app.set("sockets", sockets);
    });

    socket.on("end", sessionId => {
      delete sockets[sessionId];

      socket.disconnect(0);
      app.set("sockets", sockets);

      console.log(`Close connection ${ sessionId }`);
    });
  });

  app.set("io", io);

  // Contracts creation listeners
  newContract(context.db);

  // Minter listeners
  newMinterCollection();

  // RAIR listeners
  rairMintingInfo();

}

(async () => {
  await main()
})().catch(e => {
  console.error(e)
  process.exit()
})
