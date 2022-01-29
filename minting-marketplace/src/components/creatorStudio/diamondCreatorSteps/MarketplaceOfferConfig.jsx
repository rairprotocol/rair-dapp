import {useState, useEffect } from 'react';
import chainData from '../../../utils/blockchainData';
import { utils } from 'ethers';
import { useSelector } from 'react-redux';
import DiamondCustomPaymentRow from './diamondCustomPaymentRow.jsx'

const MarketplaceOfferConfig = ({
	array,
	index,
	nodeFee,
	minterDecimals,
	treasuryFee,
	treasuryAddress,
	simpleMode,
	rerender
}) => {
	let item = array[index];
	const { currentUserAddress, diamondMarketplaceInstance } = useSelector(store => store.contractStore);

	
	const [customPayments, setCustomPayments] = useState([{
		message: 'Node address',
		recipient: process.env.REACT_APP_NODE_ADDRESS,
		percentage: nodeFee,
		editable: false
	},{
		message: 'Treasury address',
		recipient: treasuryAddress,
		percentage: treasuryFee,
		editable: false
	},{
		message: 'Creator address (You)',
		recipient: currentUserAddress,
		percentage: 90 * Math.pow(10, minterDecimals),
		editable: true
	}]);

	useEffect(() => {
		if (!array[index].marketData || array[index].marketData.fromMarket === false) {
			return;
		}
		setCustomPayments([{
			message: 'Node address',
			recipient: process.env.REACT_APP_NODE_ADDRESS,
			percentage: nodeFee,
			editable: false
		},{
			message: 'Treasury address',
			recipient: treasuryAddress,
			percentage: treasuryFee,
			editable: false
		}]
		.concat(array[index].marketData.fees
			.map(fee => ({
				recipient: fee.recipient,
				percentage: fee.percentage.toString(),
				editable: false,
				message: 'Data from the marketplace'
			}))))
	}, [array, index, nodeFee, treasuryAddress, treasuryFee])

	const removePayment = (index) => {
		let aux = [...customPayments];
		aux.splice(index, 1);
		setCustomPayments(aux);
	}

	const addPayment = () => {
		let aux = [...customPayments];
		aux.push({
			recipient: '',
			percentage: 0,
			editable: true
		});
		setCustomPayments(aux);
	}

	useEffect(() => {
		array[index].customSplits = customPayments;
	}, [customPayments, rerender, array, index]);

	let total = customPayments.reduce((prev, current) => {return Number(prev) + Number(current.percentage)}, 0);

	return <div className={`rounded-rair col-12 col-md-12 ${!item.selected && 'text-secondary'}`}>
		<div className='row w-100 p-3'>
			<div className='col-11 rounded-rair text-start'>
				<h3>{item.offerName}</h3>
				<h5 style={{display: 'inline'}}>
					{item.tokensAllowed}
				</h5> tokens available for <h5 style={{display: 'inline'}}>
					{utils.formatEther(item.price)} {chainData[window.ethereum.chainId].symbol}
				</h5>
			</div>
			<div className='col-1 rounded-rair text-end'>
				{item.marketData.fromMarket && <abbr title='On the marketplace!'>
					<i className={`fas btn btn-success fa-check`} />
				</abbr>}
				{!item.marketData.fromMarket && <button onClick={() => {
					array[index].selected = !array[index].selected;
					rerender()
				}} className={`btn btn-${array[index].selected ? 'royal-ice' : 'danger'} rounded-rair`}>
					<i className={`fas fa-${array[index].selected ? 'check' : 'times'}`} />
				</button>}
				{!simpleMode && !item.marketData.fromMarket && <button disabled={!array[index].selected} onClick={() => {
					array[index].marketData.visible = !array[index].marketData.visible;
					rerender()
				}} className={`btn btn-${array[index]?.marketData?.visible ? 'royal-ice' : 'danger'} rounded-rair`}>
					<abbr title={array[index]?.marketData?.visible ? 'Public offer' : 'Hidden offer'}>
						<i className={`fas fa-${array[index]?.marketData?.visible ? 'eye' : 'eye-slash'}`} />
					</abbr>
				</button>}
			</div>
			{!simpleMode && <details className='text-start col-12' style={{position: 'relative'}}>
				<summary className='mb-1'>
					<small>Royalty splits</small>
				</summary>
				{customPayments?.length !== 0 &&
					<table className='col-12 text-start'>
						<thead>
							<tr>
								<th>
									Recipient Address
								</th>
								<th>
									Percentage
								</th>
								<th />
							</tr>
						</thead>
						<tbody>
							{customPayments.map((customPaymentItem, index, array) => {
								return <DiamondCustomPaymentRow
											key={index}
											index={index}
											array={customPayments}
											deleter={removePayment}
											renderer={rerender}
											minterDecimals={minterDecimals}
											disabled={!item.selected}
											{...customPaymentItem}
										/>
							})}
						</tbody>
					</table>}
				<div className='row w-100'>
					<div className='col-12 col-md-10 py-2 text-center'>
						Total: {(total) / Math.pow(10, minterDecimals)}%
					</div>
					<button disabled={total >= 100 * Math.pow(10, minterDecimals)} onClick={addPayment} className='col-12 col-md-2 rounded-rair btn btn-stimorol'>
						<i className='fas fa-plus'/> Add
					</button>
				</div>
				{false && item.marketplaceOfferIndex &&
					<div className='col-12 rounded-rair text-center'>
						<button onClick={() => {
							console.log(customPayments);
							console.log(diamondMarketplaceInstance.functions);
						}} className='btn btn-stimorol rounded-rair'>
							Update custom splits
						</button>
					</div>}
			</details>}
			<hr />
		</div>
	</div>
}

export default MarketplaceOfferConfig;
