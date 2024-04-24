const { deployments } = require('hardhat');

const wasteTime = (ms) => new Promise((resolve) => {
    setTimeout(resolve, ms);
});

const deploy = async (deploymentName, args = [], deployerAddress) => {
    const { deploy } = deployments;
    const deployment = await deploy(deploymentName, { 
        from: deployerAddress,
        waitConfirmations: 6,
        args,
    });
	console.log(`${deploymentName} deployed on address: ${deployment.receipt.contractAddress}`);
    return deployment;
}

const verify = async (deployment, args) => {
    if (deployment.newlyDeployed) {
        console.info("Waiting a minute before verification process")
        wasteTime(60000);
        try {
            await hre.run("verify:verify", {
                address: deployment.receipt.contractAddress,
                constructorArguments: args
            });
        } catch (err) {
            console.error(err);
        }
    }
}

const deployAndVerify = async (contractName, arguments, deployerAddress) => {
	const deploymentData = await deploy(contractName, arguments, deployerAddress);
    await verify(deploymentData, arguments);
    return deploymentData;
}

module.exports = {
    deploy,
    verify,
    deployAndVerify,
}