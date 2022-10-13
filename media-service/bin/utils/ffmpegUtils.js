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
const {
  genericConversionParams,
  standardResolutions,
} = require('../videoConfig');

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
        log.info(`Encrypting ${entry}`);
        const encryptedPath = `${fullPath}.encrypted`;
        try {
          const iv = intToByteArray(parseInt(entry.match(/([0-9]+).ts/)[1]));
          const encrypt = createCipheriv('aes-256-gcm', key, iv);
          const source = createReadStream(fullPath);
          const dest = createWriteStream(encryptedPath);

          source.pipe(encrypt).pipe(dest).on('finish', () => {
            // overwrite the unencrypted file so we don't have to modify the manifests
            renameSync(encryptedPath, fullPath);
            log.info(`finished encrypting: ${fullPath}`);
            return resolve({ [_.chain(entry).split('.').head().value()]: encrypt.getAuthTag().toString('hex') });
          });
        } catch (e) {
          log.error(`Could not encrypt, ${fullPath}, ${e}`);
          reject(e);
        }
      });
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

const convertToHLS = async (
  mediaData,
  speed,
  socketInstance,
) => {
  try {
    log.info('Converting');
    const totalRuntime = mediaData.duration.replace('.', '').replace(':', '').replace(':', '');

  const promise = new Promise((resolve, reject) => {
    try {
      const videoConversion = standardResolutions.map(({
        height, videoBitrate, maximumBitrate, bufferSize, audioBitrate,
      }) => spawn(ffmpeg.path, [
        '-i', `${mediaData.path}`,
        ...(mediaData.type === 'video' ? ['-vf', `scale=-2:${height}`] : []),
        '-hls_time', mediaData.type === 'audio' ? '15' : '7',
        ...genericConversionParams,
        '-preset', `${speed}`,
        '-b:v', `${videoBitrate}k`,
        '-maxrate', `${maximumBitrate}k`,
        '-bufsize', `${bufferSize}k`,
        '-b:a', `${audioBitrate}k`,
        `${mediaData.destination}/${height}p.m3u8`,
      ]));

      videoConversion[0].stderr.on('data', () => {});
      videoConversion[0].on('exit', (code) => {
        log.info(`finish child convertingProcess 1 with code ${code}`);
      });

      videoConversion[1].stderr.on('data', () => {});
      videoConversion[1].on('exit', (code) => {
        log.info(`finish child convertingProcess 2 with code ${code}`);
      });

      videoConversion[2].stderr.on('data', () => {});
      videoConversion[2].on('exit', (code) => {
        log.info(`finish child convertingProcess 3 with code ${code}`);
      });

      videoConversion[3].stderr.on('data', () => {});
      videoConversion[3].on('exit', (code) => {
        log.info(`finish child convertingProcess 4 with code ${code}`);
      });

      videoConversion[4].stderr.on('data', () => {});
      videoConversion[4].on('exit', (code) => {
        log.info(`finish child convertingProcess 5 with code ${code}`);
      });

      videoConversion[5].stderr.on('data', (data) => {
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
      videoConversion[5].on('close', () => {
        resolve();
      });
    } catch (e) {
      log.error(e);
      reject(e);
    }
  });

    await promise;
    rm(mediaData.path, log.info);
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
    const { stderr } = await spawnSync(ffmpeg.path, ['-i', `${mediaData.path}`]);
    const stringifiedData = stderr.toString();
    const duration = stringifiedData.split('Duration: ')[1]?.split(',')[0];
    if (duration) {
      mediaData.duration = duration;
    }
    if (!['audio', 'document'].includes(mediaData.type)) {
      try {
        let [width, height] = stringifiedData?.split('Video: ')[1]?.split('fps')[0]?.split('x');
        height = height.split(' [')[0];
        width = width.split(', ').at(-1);
        if (width) {
          mediaData.width = width;
        }
        if (height) {
          mediaData.height = height;
        }
      } catch (e) {
        log.error('Error fetching video dimensions!', e);
      }
    }
  } catch (e) {
    log.error(e);
  }
};

const generateThumbnails = async (
  mediaData,
  socketInstance,
) => {
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
