const standardResolutions = [
  {
    height: 144,
    videoBitrate: 200,
    maximumBitrate: 212,
    bufferSize: 200,
    audioBitrate: 42,
    bandwith: 200000,
  },
  {
    height: 240,
    videoBitrate: 400,
    maximumBitrate: 425,
    bufferSize: 500,
    audioBitrate: 96,
    bandwith: 400000,
  },
  {
    height: 360,
    videoBitrate: 800,
    maximumBitrate: 856,
    bufferSize: 1200,
    audioBitrate: 96,
    bandwith: 800000,
  },
  {
    height: 480,
    videoBitrate: 1400,
    maximumBitrate: 1498,
    bufferSize: 2100,
    audioBitrate: 128,
    bandwith: 1400000,
  },
  {
    height: 720,
    videoBitrate: 2800,
    maximumBitrate: 2996,
    bufferSize: 4200,
    audioBitrate: 128,
    bandwith: 2800000,
  },
  {
    height: 1080,
    videoBitrate: 5000,
    maximumBitrate: 5350,
    bufferSize: 7500,
    audioBitrate: 192,
    bandwith: 5000000,
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

module.exports = {
  standardResolutions,
  genericConversionParams,
};
