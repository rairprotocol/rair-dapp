import {useState, useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';

const MyNFTs = props => {

	const aux = useSelector(state => state.accessStore);
	console.log(aux);

	useEffect(() => {
		if (window.ethereum) {

		}
	}, []);

	return <>
		
	</>
}

export default MyNFTs;