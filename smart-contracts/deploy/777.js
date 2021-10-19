const {deployments, ethers} = require('hardhat');

module.exports = async ({accounts, getUnnamedAccounts}) => {
	const {deploy} = deployments;
	const [deployerAddress] = await getUnnamedAccounts();
	console.log('ERC777 deployed at', (await deploy('RAIR777', {
		from: deployerAddress,
		//proxy: true,
		args: [
			// Initial balance: Ten million - 10,000,000.000000000000000000
			'10000000000000000000000000',
			// Default Operators
			[
				// Juan
				'0xEC30759D0A3F3CE0A730920DC29d74e441f492C3',
				// Garret
				'0xf3FC93b77A1A39610aa800734dfD017Ca293e53d',
				// Chris
				'0xF31263051C09BCC2853DaC78185E1e5C59f4Ee56'
			]
		],
		//proxyContract: "OpenZeppelinTransparentProxy"
	})).receipt.contractAddress);
};

module.exports.tags = ['ERC777'];