import {useState} from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import InputField from '../common/InputField.jsx';
import {useSelector} from 'react-redux';
import {erc721Abi} from '../../contracts';
import chainData from '../../utils/blockchainData';

const rSwal = withReactContent(Swal);

const ModalContent = ({instance, blockchain, firstToken, lastToken, productIndex}) => {

	const [lockedTokens, setLockedTokens] = useState(0);

	return <>
		<InputField 
			label='Number of tokens to unlock the range:'
			customClass='form-control'
			labelClass='w-100 text-center'
			type='number'
			min={0}
			max={lastToken - firstToken}
			getter={lockedTokens}
			setter={setLockedTokens}
		/>
		<br />
		<button disabled={blockchains[blockchain] !== window.ethereum.chainId || !instance} onClick={async e => {
			await instance.createRangeLock(productIndex, firstToken, lastToken, lockedTokens);
			rSwal.close();
		}} className='btn my-3 btn-stimorol'>
			Lock range!
		</button>
	</>
}

const blockchains = {
	'BNB': '0x61',
	'ETH': '0x5',
	'tMATIC': '0x13881'
}

const LockRange = ({address, blockchain, firstToken, lastToken, productIndex}) => {
	const {programmaticProvider, contractCreator} = useSelector(store => store.contractStore);
	const {primaryColor, secondaryColor} = useSelector(store => store.colorStore);

	let onMyChain = window.ethereum ? chainData[blockchain]?.chainId === window.ethereum.chainId : chainData[blockchain]?.chainId === programmaticProvider.provider._network.chainId;

	return <button
		disabled={address === undefined || contractCreator === undefined || !window.ethereum}
		className={`btn btn-${onMyChain ? 'stimorol' : 'royal-ice'} py-0 col-12`}
		onClick={async e => {
			if (!onMyChain) {
				if (window.ethereum) {
					await window.ethereum.request({
						method: 'wallet_switchEthereumChain',
						params: [{ chainId: chainData[blockchain].chainId }],
					});
				} else {
					// Code for suresh goes here
				}
			} else {
				rSwal.fire({
					html: <ModalContent
						blockchain={blockchain}
						instance={await contractCreator(address, erc721Abi)}
						firstToken={firstToken}
						lastToken={lastToken}
						productIndex={productIndex}
					/>,
					showConfirmButton: false,
					customClass: {
						popup: `bg-${primaryColor}`,
						htmlContainer: `text-${secondaryColor}`,
					}
				})
			}
		}}>
			{onMyChain ?
				<>
					Lock Range <i className='fas fa-lock' />
				</>
				:
				<>
					Switch to <b>{chainData[blockchain]?.chainId}</b>
				</>
			}
	</button>
};

export default LockRange;