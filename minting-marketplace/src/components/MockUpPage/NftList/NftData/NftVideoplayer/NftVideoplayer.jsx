import { useEffect, useState, useCallback } from 'react';
import { useParams, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import videojs from 'video.js';
import Swal from 'sweetalert2';
import setDocumentTitle from '../../../../../utils/setTitle';

const NftVideoplayer = ({selectVideo}) => {
    console.log(selectVideo, 'selectVideo');
	const params = useParams();
	const history = useHistory();
    const mainManifest = "stream.m3u8";

	const { programmaticProvider } = useSelector(state => state.contractStore);

	const [videoName,] = useState(Math.round(Math.random() * 10000));
	const [mediaAddress, setMediaAddress] = useState(Math.round(Math.random() * 10000));

	// const btnGoBack = () => {
	// 	history.goBack();
	// }

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
		let streamAddress = await (await fetch('/api/auth/get_token/' + parsedResponse.message.challenge + '/' + signature + '/' + selectVideo._id)).json();
		if (streamAddress.success) {
			await setMediaAddress('/stream/' + streamAddress.token + '/' +selectVideo._id + '/' + mainManifest);
			setTimeout(() => {
				videojs('vjs-' + videoName);
			}, 1000);
		} else {
			console.error(streamAddress);
			Swal.fire('NFT required to view this content');
		}
	}, [programmaticProvider, selectVideo._id, mainManifest, videoName])

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
		<div className="" style={{  
            width: '406px', height: '406px'
            }}>
			<video id={'vjs-' + videoName}
            style={{ 
                 width: 'inherit', height: 'inherit' ,
                  borderRadius: '16px'}}
				className="video-js "
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

export default NftVideoplayer;
