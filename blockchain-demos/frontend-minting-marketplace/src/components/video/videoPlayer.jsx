import { useEffect, useState, useCallback } from 'react';
import { useParams, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import videojs from 'video.js';
import Swal from 'sweetalert2';
import setDocumentTitle from '../../utils/setTitle';

const VideoPlayer = () => {
	const params = useParams();
	const history = useHistory();

	const { programmaticProvider } = useSelector(state => state.contractStore);

	const [videoName,] = useState(Math.round(Math.random() * 10000));
	const [mediaAddress, setMediaAddress] = useState(Math.round(Math.random() * 10000));

	const btnGoBack = () => {
		history.goBack();
	}

	const requestChallenge = useCallback(async () => {
		let signature;
		let parsedResponse;
		if (window.ethereum) {
			let [account] = await window.ethereum.request({ method: 'eth_requestAccounts' })
			let response = await (await fetch('/api/auth/get_challenge/' + account)).json()
			parsedResponse = JSON.parse(response.response);
			signature = await window.ethereum.request({
				method: 'eth_signTypedData_v4',
				params: [account, response.response],
				from: account
			});
		} else if (programmaticProvider) {
			let response = await (await fetch('/api/auth/get_challenge/' + programmaticProvider.address)).json()
			parsedResponse = JSON.parse(response.response);
			// EIP712Domain is added automatically by Ethers.js!
			let { EIP712Domain, ...revisedTypes } = parsedResponse.types;
			signature = await programmaticProvider._signTypedData(
				parsedResponse.domain,
				revisedTypes,
				parsedResponse.message);
		} else {
			Swal.fire('Error', 'Unable to decrypt videos', 'error');
			return;
		}
		let streamAddress = await (await fetch('/api/auth/get_token/' + parsedResponse.message.challenge + '/' + signature + '/' + params.videoId)).json();
		if (streamAddress.success) {
			await setMediaAddress('/stream/' + streamAddress.token + '/' + params.videoId + '/' + params.mainManifest);
			setTimeout(() => {
				videojs('vjs-' + videoName);
			}, 1000);
		} else {
			console.error(streamAddress);
			Swal.fire('NFT required to view this content');
		}
	}, [params.mainManifest, params.videoId, videoName, programmaticProvider])

	useEffect(() => {
		requestChallenge();
		return () => {
			setMediaAddress();
		};
	}, [requestChallenge])

	useEffect(() => {
		setDocumentTitle(`Streaming`);
	}, [videoName])

	return <>
	<div className='video-btn-back'>
		<button onClick={() => btnGoBack()}>back</button>
	</div>
		<div className="col-12 row mx-0 bg-secondary h1" style={{ minHeight: '50vh' }}>
			<video id={'vjs-' + videoName}
				className="video-js vjs-16-9"
				controls
				preload="auto"
				autoPlay
				//poster={ video && ('/thumbnails/' + video.thumbnail + '.png') }
				data-setup="{}">
				<source
					src={mediaAddress}
					type="application/x-mpegURL" />
			</video>
		</div>
	</>
};

export default VideoPlayer;
