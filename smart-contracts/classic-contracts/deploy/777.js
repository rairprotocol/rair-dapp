const {deployments, ethers} = require('hardhat');

module.exports = async ({accounts, getUnnamedAccounts}) => {
	const {deploy} = deployments;
	const [deployerAddress] = await getUnnamedAccounts();
	console.log('New ERC777 deployed at', (await deploy('RAIR777', {
		from: deployerAddress,
		args: [
			// Initial supply: 222 million - 222,000,000.000000000000000000
			'222000000000000000000000000',
			// Maximum supply: 400 million - 400,000,000.000000000000000000
			'400000000000000000000000000',
			// Initial Supply recipient and DEFAULT_ADMIN_ROLE holder (can grant the MINTER role)
			'0xf3FC93b77A1A39610aa800734dfD017Ca293e53d', // Garret's address
			// Default Operators (Can move tokens around without an explicit approval)
			[
				// Juan (only for testnets)
				//'0xEC30759D0A3F3CE0A730920DC29d74e441f492C3',
				// Garret
				'0xf3FC93b77A1A39610aa800734dfD017Ca293e53d',
				// Chris
				'0xF31263051C09BCC2853DaC78185E1e5C59f4Ee56'
			]
		],
	})).receipt.contractAddress);
};

module.exports.tags = ['ERC777'];