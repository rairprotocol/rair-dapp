async function main() {

        const ResaleFactory = await ethers.getContractFactory("RAIR");

        // Deployment
        const RAIR = await ResaleFactory.deploy();
        console.log("Contract deploued to address:", RAIR.address);

}


main()
.then(() => process.exit(0))
.catch(error => {
  console.error(error);
  process.exit(1);
});

