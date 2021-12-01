const ffmpeg = require('@ffmpeg-installer/ffmpeg');
const { spawnSync, spawn } = require('child_process');
const path = require('path');
const {generateKeySync, createCipheriv} = require('crypto');
const {copyFileSync, rm, promises, createReadStream, createWriteStream, renameSync} = require('fs');

const standardResolutions = [
	{height: 144, videoBitrate: 200, maximumBitrate: 212, bufferSize: 200, audioBitrate: 42, bandwith: 200000},
	{height: 240, videoBitrate: 400, maximumBitrate: 425, bufferSize: 500, audioBitrate: 96, bandwith: 400000},
	{height: 360, videoBitrate: 800, maximumBitrate: 856, bufferSize: 1200, audioBitrate: 96, bandwith: 800000},
	{height: 480, videoBitrate: 1400, maximumBitrate: 1498, bufferSize: 2100, audioBitrate: 128, bandwith: 1400000},
	{height: 720, videoBitrate: 2800, maximumBitrate: 2996, bufferSize: 4200, audioBitrate: 128, bandwith: 2800000},
	{height: 1080, videoBitrate: 5000, maximumBitrate: 5350, bufferSize: 7500, audioBitrate: 192, bandwith: 5000000}
];

const genericConversionParams = [
	'-c:a', 'aac',
	'-ar', '48000',
	'-c:v', 'h264',
	'-profile:v', `main`,
	'-level', `3.0`,
	'-start_number', `0`,
	'-crf', `20`,
	'-sc_threshold', `0`,
	'-g', `48`,
	'-keyint_min', `48`,
	'-hls_time', `4`,
	'-hls_list_size', `0`,
	'-hls_playlist_type', `vod`
]


function intToByteArray(num) {
	var byteArray = new Uint8Array(16);
	for (var index = 0; index < byteArray.length; index++) {
		var byte = num & 0xff;
		byteArray[index] = byte;
		num = (num - byte) / 256;
	}
	return byteArray;
}

const encryptFolderContents = async (videoData, encryptExtensions) => {
	console.log(videoData);

	const key = generateKeySync('aes', { length: 128 });

	const promiseList = [];

	let directoryData = await promises.readdir(videoData.destination);

	for await (entry of directoryData) {
		const extension = entry.split('.')[1];
		if (!encryptExtensions.includes(extension)) {
			console.log(`Ignoring file ${entry}`);
			continue;
		}
		const promise = new Promise((resolve, reject) => {
			const fullPath = path.join(videoData.destination, entry);
			console.log(`Encrypting ${entry}`);
			const encryptedPath = fullPath + '.encrypted';
			try {
				const iv = intToByteArray(parseInt(entry.match(/([0-9]+).ts/)[1]));
				const encrypt = createCipheriv('aes-128-cbc', key, iv);
				const source = createReadStream(fullPath);
				const dest = createWriteStream(encryptedPath);
				source.pipe(encrypt).pipe(dest).on('finish', () => {
					// overwrite the unencrypted file so we don't have to modify the manifests
					renameSync(encryptedPath, fullPath);
					resolve(true);
					console.log(`finished encrypting: ${fullPath}`);
				});
			} catch (e) {
				console.error('Could not encrypt', fullPath, e);
				reject(e);
			}
		});
		promiseList.push(promise);
	}
	await Promise.all(promiseList);
	console.log('Done!');
	return key.export();
}

const convertToHLS = async (videoData, socketInstance) => {
	console.log('Converting');
	const totalRuntime = videoData.duration.replace('.','').replace(':','').replace(':','');
	const promise = new Promise(async (resolve, reject) => {
		try {
			const resolutionConfigs = standardResolutions.map(({height, videoBitrate, maximumBitrate, bufferSize, audioBitrate}) => {
				return [
					'-vf', `scale=-2:${height}`,
					...genericConversionParams,
					'-b:v', `${videoBitrate}k`,
					'-maxrate', `${maximumBitrate}k`,
					'-bufsize', `${bufferSize}k`,
					'-b:a', `${audioBitrate}k`,
					`${videoData.destination}/${height}p.m3u8`,
				];
			});
			let videoConversion = await spawn(ffmpeg.path, ['-i', `${videoData.path}`].concat(...resolutionConfigs));
			videoConversion.stderr.on('data', data => {
				let conversionProgress = data.toString()?.split('time=')[1]?.split(" bitrate")[0];
				if (conversionProgress) {
					conversionProgress = conversionProgress.replace('.','').replace(':','').replace(':','');
					socketInstance.emit('uploadProgress', {
						message: `Converting: ${videoData.originalname} - ${((conversionProgress / totalRuntime) * 100).toFixed(2)}%`,
						last: false,
						done: 10
					});
				}
			});
			videoConversion.on('close', data => {
				resolve();
			});
		} catch (e) {
			console.error(e);
			reject(e);
		}
	});
	await promise;
	await rm(videoData.path, console.log);
	socketInstance.emit('uploadProgress', {
		message: `${ videoData.originalname } raw deleted`,
		last: false
	});
	copyFileSync(
		path.join(videoData.destination, '..', 'stream.m3u8.template'),
		path.join(videoData.destination, 'stream.m3u8')
	);
}

const getMediaData = async (videoData) => {
	try {
		let {output, stdout, stderr, status} = await spawnSync(ffmpeg.path, ['-i', `${videoData.path}`]);
		let stringifiedData = stderr.toString();
		let [useless, width, height] = stringifiedData?.split('Video: ')[1]?.split('fps')[0]?.split('x');
		height = height.split(' [')[0];
		width = width.split(', ').at(-1);
		let duration = stringifiedData.split('Duration: ')[1]?.split(',')[0];
		if (duration) {
			videoData.duration = duration;
		}
		if (width) {
			videoData.width = width;
		}
		if (height) {
			videoData.height = height;
		}
	} catch (e) {
		console.error(e);
	}
}

const generateThumbnails = async (videoData, socketInstance) => {
	const generalThumbnailData = ['-vf', '"select=gt(scene\,0.6)"', '-vf', 'scale=144:-1', '-vsync', 'vfr', '-frames:v'];
	const thumbnailParams = ['1', `${videoData.destination}/thumbnail.webp`];
	const animatedThumbnailParams = ['120', `${videoData.destination}/thumbnail.gif`];

	try {
		let staticThumbnail = await spawnSync(ffmpeg.path, ['-i', `${videoData.path}`].concat(generalThumbnailData, thumbnailParams));
		socketInstance.emit('uploadProgress', {
			message: `${ videoData.originalname } generating static thumbnail`,
			last: false,
			done: 10
		});
		let animatedThumbnail = await spawnSync(ffmpeg.path, ['-i', `${videoData.path}`].concat(generalThumbnailData, animatedThumbnailParams));
		socketInstance.emit('uploadProgress', {
			message: `${ videoData.originalname } generating animated thumbnail`,
			last: false,
			done: 10
		});
		videoData.thumbnailName = 'thumbnail';
	} catch (e) {
		console.error(e);
	}
}

module.exports = {
	generateThumbnails,
	getMediaData,
	convertToHLS,
	encryptFolderContents
};