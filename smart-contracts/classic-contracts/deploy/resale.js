async function main() {
    const [deployer] = await ethers.getSigners();

    console.log('Deploying contracts with the account:', deployer.address);
    console.log('Account balance:', (await deployer.getBalance()).toString());

    const ResaleMarketPlace = await ethers.getContractFactory(
        'Resale_MarketPlace'
    );
    const marketPlace = await ResaleMarketPlace.deploy(
        // Treasury_Address
        // Howard
        '0x1EEBb16264D8BDB031685bEfF3d66bd6849F3942',
        // Node_Address
        // Howard
        '0x1EEBb16264D8BDB031685bEfF3d66bd6849F3942'
    );

    console.log('Token address:', marketPlace.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });