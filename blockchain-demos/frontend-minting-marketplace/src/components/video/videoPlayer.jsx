import { useEffect, useState } from 'react';
import {useParams} from "react-router-dom";
import videojs from 'video.js';
import Swal from 'sweetalert2';

const VideoPlayer = () => {
	const params = useParams();

	console.log(params);

	const [videoName,] = useState(Math.round(Math.random() * 10000));
	const [mediaAddress, setMediaAddress] = useState(Math.round(Math.random() * 10000));
	
	const requestChallenge = async () => {
		let [account] = await window.ethereum.request({ method: 'eth_requestAccounts' })
		let response = await (await fetch('/api/auth/get_challenge/' + account)).json()
		let parsedResponse = JSON.parse(response.response);
		let signature = await window.ethereum.request({
			method: 'eth_signTypedData_v4',
			params: [account, response.response],
			from: account
		});
		let streamAddress = await(await fetch('/api/auth/get_token/' + parsedResponse.message.challenge + '/' + signature + '/' + params.videoId)).json();
		if (streamAddress.success) {
			await setMediaAddress('/stream/' + streamAddress.token + '/' + params.videoId + '/' + params.mainManifest);
			setTimeout(() => {
				videojs('vjs-' + videoName);
			}, 1000);
		}
	}

	useEffect(() => {
		requestChallenge();
		return () => {
			setMediaAddress();
		};
	}, [])
	return <div className="w-100 row mx-0 bg-secondary h1" style={ { minHeight: '50vh' } }>
		<video id={ 'vjs-' + videoName }
					 className="video-js vjs-16-9"
					 controls
					 preload="auto"
					 autoPlay
					 //poster={ video && ('/thumbnails/' + video.thumbnail + '.png') }
					 data-setup="{}">
			<source
				src={ mediaAddress }
				type="application/x-mpegURL"/>
		</video>
	</div>;
};

export default VideoPlayer;
