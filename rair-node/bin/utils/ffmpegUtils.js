const ffmpeg = require('@ffmpeg-installer/ffmpeg');
const { spawnSync, spawn } = require('child_process');
const path = require('path');
const { generateKeySync, createCipheriv } = require('crypto');
const {
  copyFileSync, rm, promises, createReadStream, createWriteStream, renameSync,
} = require('fs');
const _ = require('lodash');
const AppError = require('./errors/AppError');
const log = require('./logger')(module);

const standardResolutions = [
  {
    height: 144, videoBitrate: 200, maximumBitrate: 212, bufferSize: 200, audioBitrate: 42, bandwith: 200000,
  },
  {
    height: 240, videoBitrate: 400, maximumBitrate: 425, bufferSize: 500, audioBitrate: 96, bandwith: 400000,
  },
  {
    height: 360, videoBitrate: 800, maximumBitrate: 856, bufferSize: 1200, audioBitrate: 96, bandwith: 800000,
  },
  {
    height: 480, videoBitrate: 1400, maximumBitrate: 1498, bufferSize: 2100, audioBitrate: 128, bandwith: 1400000,
  },
  {
    height: 720, videoBitrate: 2800, maximumBitrate: 2996, bufferSize: 4200, audioBitrate: 128, bandwith: 2800000,
  },
  {
    height: 1080, videoBitrate: 5000, maximumBitrate: 5350, bufferSize: 7500, audioBitrate: 192, bandwith: 5000000,
  },
];

const genericConversionParams = [
  '-c:a', 'aac',
  '-ar', '48000',
  '-c:v', 'h264',
  '-profile:v', 'main',
  '-level', '3.0',
  '-start_number', '0',
  '-crf', '20',
  '-sc_threshold', '0',
  '-g', '48',
  '-keyint_min', '48',
  '-hls_list_size', '0',
  '-hls_playlist_type', 'vod',
];

function intToByteArray(num) {
  const byteArray = new Uint8Array(16);
  for (let index = 0; index < byteArray.length; index++) {
    const byte = num & 0xff;
    byteArray[index] = byte;
    num = (num - byte) / 256;
  }
  return byteArray;
}

const encryptFolderContents = async (mediaData, encryptExtensions, socketInstance) => {
  try {
    const key = generateKeySync('aes', { length: 256 });
    const promiseList = [];

    const directoryData = await promises.readdir(mediaData.destination);

    for await (const entry of directoryData) {
      const extension = entry.split('.')[1];

      if (!encryptExtensions.includes(extension)) {
        log.info(`Ignoring file ${entry}`);
        continue;
      }

      const promise = new Promise((resolve, reject) => {
        const fullPath = path.join(mediaData.destination, entry);
        console.log(`Encrypting ${entry}`);
        const encryptedPath = `${fullPath}.encrypted`;
        const iv = intToByteArray(parseInt(entry.match(/([0-9]+).ts/)[1]));
        const encrypt = createCipheriv('aes-256-gcm', key, iv);
        const source = createReadStream(fullPath);
        const dest = createWriteStream(encryptedPath);
        source.pipe(encrypt).pipe(dest).on('finish', () => {
        // overwrite the unencrypted file so we don't have to modify the manifests
          renameSync(encryptedPath, fullPath);
          console.log(`finished encrypting: ${fullPath}`);
          return resolve({ [_.chain(entry).split('.').head().value()]: encrypt.getAuthTag().toString('hex') });
        });
      }).catch((e) => log.error(`Could not encrypt',${fullPath}, ${e}`));

      promiseList.push(promise);
    }
    socketInstance.emit('uploadProgress', {
      message: 'Done scheduling encryptions',
      last: false,
      done: 15,
      parts: promiseList.length,
    });
    const authOfChunks = await Promise.all(promiseList);
    const authTag = authOfChunks.reduce((pv, value) => ({ ...pv, ...value }), {});
    return { key: key.export(), authTag };
  } catch (e) {
    log.error(e);
    return new AppError('Encrypting process faild', 500);
  }
};

const convertToHLS = async (mediaData, socketInstance) => {
  try {
    log.info('Converting');
    const totalRuntime = mediaData.duration.replace('.', '').replace(':', '').replace(':', '');
    const promise = new Promise(async (resolve, reject) => {
      try {
        const resolutionConfigs = standardResolutions.map(({
          height, videoBitrate, maximumBitrate, bufferSize, audioBitrate,
        }) => [
          ...(mediaData.type === 'video' ? ['-vf', `scale=-2:${height}`] : []),
          '-hls_time', mediaData.type === 'audio' ? '15' : '7',
          ...genericConversionParams,
          '-b:v', `${videoBitrate}k`,
          '-maxrate', `${maximumBitrate}k`,
          '-bufsize', `${bufferSize}k`,
          '-b:a', `${audioBitrate}k`,
          `${mediaData.destination}/${height}p.m3u8`,
        ]);
        const videoConversion = await spawn(ffmpeg.path, ['-i', `${mediaData.path}`].concat(...resolutionConfigs));
        videoConversion.stderr.on('data', (data) => {
          let conversionProgress = data.toString()?.split('time=')[1]?.split(' bitrate')[0];
          if (conversionProgress) {
            conversionProgress = conversionProgress.replace('.', '').replace(':', '').replace(':', '');
            socketInstance.emit('uploadProgress', {
              message: `Converting: ${mediaData.originalname} - ${((conversionProgress / totalRuntime) * 100).toFixed(2)}%`,
              last: false,
              done: 10,
            });
          }
        });
        videoConversion.on('close', (data) => {
          resolve();
        });
      } catch (e) {
        log.error(e);
        reject(e);
      }
    });
    await promise;
    await rm(mediaData.path, log.info);
    socketInstance.emit('uploadProgress', {
      message: `${mediaData.originalname} raw deleted`,
      last: false,
    });
    copyFileSync(
      path.join(mediaData.destination, '..', '..', 'templates', 'stream.m3u8.template'),
      path.join(mediaData.destination, 'stream.m3u8'),
    );
  } catch (e) {
    log.error(e);
    return new AppError('Converting process faild', 500);
  }
};

const getMediaData = async (mediaData) => {
  try {
    const {
      output, stdout, stderr, status,
    } = await spawnSync(ffmpeg.path, ['-i', `${mediaData.path}`]);
    const stringifiedData = stderr.toString();
    const duration = stringifiedData.split('Duration: ')[1]?.split(',')[0];
    if (duration) {
      mediaData.duration = duration;
    }
    if (!['audio', 'document'].includes(mediaData.type)) {
      try {
        let [useless, width, height] = stringifiedData?.split('Video: ')[1]?.split('fps')[0]?.split('x');
        height = height.split(' [')[0];
        width = width.split(', ').at(-1);
        if (width) {
          mediaData.width = width;
        }
        if (height) {
          mediaData.height = height;
        }
      } catch (e) {
        log.error(`Error fetching video dimensions!, ${e}`);
      }
    }
  } catch (e) {
    log.error(e);
  }
};

const generateThumbnails = async (mediaData, socketInstance) => {
  const generalThumbnailData = ['-vf', '"select=gt(scene\,0.6)"', '-vf', 'scale=144:-1', '-vsync', 'vfr', '-frames:v'];
  const thumbnailParams = ['1', `${mediaData.destination}/thumbnail.webp`];
  const animatedThumbnailParams = ['120', `${mediaData.destination}/thumbnail.gif`];

  if (mediaData.type === 'video') {
    try {
      const staticThumbnail = await spawnSync(ffmpeg.path, ['-i', `${mediaData.path}`].concat(generalThumbnailData, thumbnailParams));
      socketInstance.emit('uploadProgress', {
        message: `${mediaData.originalname} generating static thumbnail`,
        last: false,
        done: 10,
      });
      const animatedThumbnail = await spawnSync(ffmpeg.path, ['-i', `${mediaData.path}`].concat(generalThumbnailData, animatedThumbnailParams));
      socketInstance.emit('uploadProgress', {
        message: `${mediaData.originalname} generating animated thumbnail`,
        last: false,
        done: 10,
      });
      mediaData.staticThumbnail = 'thumbnail.webp';
      mediaData.animatedThumbnail = 'thumbnail.gif';
    } catch (e) {
      log.error(e);
    }
  } else if (mediaData.type === 'audio') {
    mediaData.staticThumbnail = process.env.DEFAULT_PRODUCT_COVER;
  }
};

module.exports = {
  generateThumbnails,
  getMediaData,
  convertToHLS,
  encryptFolderContents,
};
