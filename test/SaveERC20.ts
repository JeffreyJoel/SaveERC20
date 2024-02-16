import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("SaveERC20", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deploySaveERC20Fixture() {
    const [owner, otherAccount] = await ethers.getSigners();

    const SavedToken = await ethers.getContractFactory("MyToken");
    const savedToken = await SavedToken.deploy(owner.address);

    const SaveERC20 = await ethers.getContractFactory("SaveERC20");
    const saveERC20 = await SaveERC20.deploy(savedToken.getAddress());
    const zeroAddress = ethers.ZeroAddress;

    return { savedToken, saveERC20, owner, otherAccount, zeroAddress };
  }

  describe("Deployment", function () {
    it("deposit ether Properly", async function () {
      const amount = 1000;
      const { savedToken, saveERC20, owner } = await loadFixture(
        deploySaveERC20Fixture
      );
      await savedToken.approve(saveERC20.target, amount);

      await saveERC20.connect(owner).deposit(amount);
      const bal = await saveERC20.connect(owner).checkContractBalance();
      expect(owner.address).is.not.equal(
        "0x0000000000000000000000000000000000000000"
      );
      expect(amount).is.not.equal(0);
      expect(await saveERC20.connect(owner).checkContractBalance()).to.equal(
        amount
      );
      console.log(bal);
    });

    it("Should prevent user from withdrawing", async function () {
      const amount = 1000;
      const { savedToken, saveERC20, owner } = await loadFixture(
        deploySaveERC20Fixture
      );

      await savedToken.approve(saveERC20.target, amount);

      await saveERC20.connect(owner).deposit(amount);

      const connectedOwner = saveERC20.connect(owner);
      const withdraw1 = saveERC20.connect(owner).withdraw(amount);
      const balance = await saveERC20.checkUserBalance(owner);

      await expect(connectedOwner.withdraw(amount)).to.be.revertedWith(
        "insufficient funds"
      );
     

      const withdrawal = 0;
      const [signer] = await ethers.getSigners();

      await expect(
        saveERC20.connect(owner).withdraw(withdrawal)
      ).to.be.revertedWith("can't withdraw zero value");
    });

    it("Should withdraw the token properly", async function () {
      const amount = 1000;
      const { savedToken, saveERC20, owner } = await loadFixture(
        deploySaveERC20Fixture
      );

      await savedToken.approve(saveERC20.target, amount);

      await saveERC20.connect(owner).deposit(amount);
      await saveERC20.connect(owner).withdraw(200);
      const balance = await saveERC20.checkUserBalance(owner);

      expect(balance).to.equal(800);
    });

    it("Should check the user's balance", async function () {
      const amount = 1000;
      const { savedToken, saveERC20, owner } = await loadFixture(
        deploySaveERC20Fixture
      );

      await savedToken.approve(saveERC20.target, amount);

      await saveERC20.connect(owner).deposit(amount);

      const balance = await saveERC20.checkUserBalance(owner);

      expect(balance).to.equal(amount);
      // expect(withdraw).to.equal(100);
    });

    it("Should check the contract balance", async function () {
      const amount = 1000;
      const { savedToken, saveERC20, owner } = await loadFixture(
        deploySaveERC20Fixture
      );

      await savedToken.approve(saveERC20.target, amount);

      const deposit = await saveERC20.connect(owner).deposit(amount);

      const bal = await saveERC20.connect(owner).checkContractBalance();

      expect(bal).to.equal(amount);
      // expect(withdraw).to.equal(100);
    });

    it("Should allow the owner to withdraw", async function () {
      const amount = 1000;
      const { savedToken, saveERC20, owner, otherAccount } = await loadFixture(
        deploySaveERC20Fixture
      );

      await savedToken.approve(saveERC20.target, amount);

      const deposit = await saveERC20.connect(owner).deposit(amount);

      const withdraw1 = await saveERC20.connect(owner).ownerWithdraw(200);

      expect(withdraw1).to.be.revertedWith("not owner");
      // expect(get)
      // expect(withdraw).to.equal(100);
    });
  });
});
