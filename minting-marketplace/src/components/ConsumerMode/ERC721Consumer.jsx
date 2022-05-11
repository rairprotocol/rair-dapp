//@ts-nocheck
import { useState, useEffect, useCallback } from 'react'
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { Link } from "react-router-dom";
import { useSelector } from 'react-redux';
import BatchMinting from './BatchMinting';
import { utils } from 'ethers';
import blockchainData from '../../utils/blockchainData';
import { metamaskCall } from '../../utils/metamaskUtils';
const MySwal = withReactContent(Swal)

const Range = ({ tokenInstance, productIndex, offerIndex, rangeIndex }) => {
	const [next, setNext] = useState();
	const [specificIndex, setSpecificIndex] = useState(0);

	const [name, setName] = useState("");
	const [price, setPrice] = useState("");
	const [start, setStart] = useState("");
	const [end, setEnd] = useState("");
	const [allowed, setAllowed] = useState("");

	const { minterInstance } = useSelector(state => state.contractStore);

	const refreshData = useCallback(async () => {
		let data = await minterInstance.getOfferRangeInfo(offerIndex, rangeIndex);
		setName(data.name);
		setPrice(data.price.toString());
		setStart(data.tokenStart.toString());
		setEnd(data.tokenEnd.toString());
		setAllowed(data.tokensAllowed.toString());
		try {
			setNext((await tokenInstance.getNextSequentialIndex(productIndex, data.tokenStart, data.tokenEnd)).toString());
		} catch (e) {
			console.error(e);
		}
	}, [minterInstance, offerIndex, rangeIndex, productIndex, tokenInstance])

	useEffect(() => {
		if (tokenInstance) {
			tokenInstance.on('Transfer(address,address,uint256)', async (from, to, tokenId) => {
				refreshData();
			})
		}
		refreshData();
	}, [refreshData, tokenInstance]);

	const batchMint = async (data) => {
		let addresses = data.map(i => i.address);
		let tokens = data.map(i => i.token);
		Swal.fire({title: 'Preparing transaction', html: 'Please wait', icon: 'info', showConfirmButton: false});
		if (await metamaskCall(minterInstance.buyTokenBatch(offerIndex, rangeIndex, tokens, addresses, {value: price * tokens.length}))) {
			Swal.fire('Success', 'Minted all tokens', 'success');
		}
	}

	return <div style={{ position: 'relative' }} className='w-100 my-2'>
		<b>{name}</b>: {allowed} tokens at {price} each!
		<br />
		<div style={{ position: 'absolute', left: 0 }}>
			{start}...
		</div>
		<div style={{ position: 'absolute', right: 0 }}>
			...{end}
		</div>
		<button onClick={async e => {
			Swal.fire({title: 'Preparing transaction', html: 'Please wait', icon: 'info', showConfirmButton: false});
			if (await metamaskCall(
					minterInstance.buyToken(offerIndex, rangeIndex, next, { value: price }), 
                	"Sorry your transaction failed! When several people try to buy at once - only one transaction can get to the blockchain first. Please try again!"
				)) {
				Swal.fire('Success', 'Token Minted!', 'success');
			}
		}} className='btn btn-success py-0'>
			Buy token #{next} for {utils.formatEther(price === '' ? 0 : price)?.toString()} {blockchainData[window?.ethereum?.chainId]?.symbol}!
		</button>
		<button onClick={e => {
			MySwal.fire({
				html: <BatchMinting
					name={name}
					start={start}
					end={end}
					price={price}
					batchMint={batchMint}
				/>,
				width: '60vw',
				showConfirmButton: false
			})
		}} className='btn py-0 btn-secondary'>
			Batch Minting
		</button>
		{start && allowed && end && <progress className='w-100' value={(end - start + 1) - allowed} max={end} />}
		{allowed} tokens left!
		{allowed && Number(allowed) !== 0 && <>
			<small>
				<details>
					<summary>
						Mint a specific token!
					</summary>
					<input type='number' value={specificIndex} onChange={e => setSpecificIndex(e.target.value)} />
					<br />
					<button disabled={next > specificIndex} onClick={async e => {
						try {
							await minterInstance.buyToken(offerIndex, rangeIndex, specificIndex, { value: price });
						} catch (err) {
							Swal.fire('Error', err?.data?.message, 'error');
						}
					}} className='btn py-0 btn-warning'>
						Buy token #{specificIndex} for {utils.formatEther(price === '' ? 0 : price).toString()} {blockchainData[window?.ethereum?.chainId]?.symbol}!
					</button>
				</details>
			</small>
		</>}
		<br />
		<hr className='w-100' />
	</div>
}

const ERC721Manager = ({ offerInfo, index, width = 6 }) => {
	const [balance, setBalance] = useState();
	const [productName, setProductName] = useState();
	const [contractName, setContractName] = useState();
	const [rangeInfo, setRangeInfo] = useState([]);
	const [refetchingFlag, setRefetchingFlag] = useState(false);

	const { minterInstance, currentUserAddress } = useSelector(state => state.contractStore);

	const refreshData = useCallback(async () => {
		setRefetchingFlag(true);
		let balances = [];
		let tokensOwned = (await offerInfo.instance.balanceOf(currentUserAddress)).toString();
		setProductName((await offerInfo.instance.getProduct(offerInfo.productIndex)).productName);
		setContractName(await offerInfo.instance.name());
		let ranges = [];
		for await (let rangeIndex of [...Array.apply(null, { length: offerInfo.ranges }).keys()]) {
			let data = await minterInstance.getOfferRangeInfo(index, rangeIndex);
			ranges.push({
				name: data.name,
				price: data.price.toString(),
				start: data.tokenStart.toString(),
				end: data.tokenEnd.toString(),
				allowed: data.tokensAllowed.toString()
			})
		}
		setRangeInfo(ranges);
		if (tokensOwned > 0) {
			for await (let index of [...Array.apply(null, { length: tokensOwned }).keys()]) {
				let token = (await offerInfo.instance.tokenOfOwnerByIndex(currentUserAddress, index)).toString();
				if ((await offerInfo.instance.tokenToProduct(token)).toString() === offerInfo.productIndex) {
					balances.push({
						token,
						internalIndex: (await offerInfo.instance.tokenToProductIndex(token)).toString()
					});
				}
			}
		}
		setBalance(balances);
		setRefetchingFlag(false);
	}, [currentUserAddress, index, minterInstance, offerInfo.instance, offerInfo.productIndex, offerInfo.ranges])

	useEffect(() => {
		refreshData();
	}, [offerInfo, currentUserAddress, refreshData]);

	return (
		<details style={{ position: 'relative' }} className={`col-12 col-md-${width} py-4 border border-white rounded`}>
			<summary>
				<div style={{ position: 'absolute', top: 0, right: '2vh' }}>
					#{index + 1}<br />
				</div>
				<h5 className='d-inline-block'>
					{productName}
				</h5>
				<Link
					to={`/rair/${offerInfo.contractAddress}/${offerInfo.productIndex}`}
					style={{ position: 'absolute', top: 0, left: '5vh' }}>
					@{contractName}
				</Link>
			</summary>
			<button onClick={refreshData} disabled={refetchingFlag} style={{ position: 'absolute', left: 0, top: 0, color: 'inherit' }} className='px-2 btn'>
				{refetchingFlag ? '...' : <i className='fas fa-redo' />}
			</button>
			<small>Contract Address: <b>{offerInfo.contractAddress}</b></small><br />
			<small>Product Index: {offerInfo.productIndex}</small><br />
			<br />
			{rangeInfo.map((item, rangeIndex) => {
				return <Range
					key={rangeIndex}
					tokenInstance={offerInfo.instance}
					productIndex={offerInfo.productIndex}
					rangeIndex={rangeIndex}
					offerIndex={index}
				/>
			})}
			<hr className='w-75 mx-auto' />
			{balance && <>
				You own {balance.length} tokens from this collection<br />
				{balance.map((item, index) => (
					<details key={index} className='w-100'>
						<summary>
							<h5 className='d-inline-block'>{item.internalIndex}</h5>
						</summary>

						{offerInfo.contractAddress}:{item.token}
						<div className='row px-0 mx-0'>
							<div className='col-9'>
								<input disabled type='number' className='form-control' placeholder='Price' />
							</div>
							<button disabled className='btn btn-primary col-3'>
								Resell
							</button>
						</div>
						<hr className='w-100' />
					</details>
				))}
			</>}
			<br />
			<hr className='w-50 mx-auto' />
		</details>
	)
}

export default ERC721Manager;