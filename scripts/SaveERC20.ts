import { ethers } from "hardhat";

async function main() {

  const saveERC20 = await ethers.deployContract("SaveERC20");

  await saveERC20.waitForDeployment();

  console.log(
    `Contract deployed to ${saveERC20.target}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
