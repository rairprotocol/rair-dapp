require('dotenv').config();

const { PUBLIC_KEY } = process.env;

async function main() {
    const RAIRTest = await ethers.getContractFactory("RairTest");
    
    //Deployment RAIRTest for Resale
    const RAIRTest = await RAIRTest.deploy(PUBLIC_KEY);
    console.log("Contract deployed to address:", RAIRTest.address);
}
  
main()
.then(() => process.exit(0))
.catch(error => {
    console.error(error);
    process.exit(1);
});