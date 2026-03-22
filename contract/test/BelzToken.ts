import { expect } from "chai";
import { ethers } from "hardhat";
import { BelzToken } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { time } from "@nomicfoundation/hardhat-network-helpers";

describe("BelzToken", () => {
    let token: BelzToken;
    let owner: SignerWithAddress;
    let alice: SignerWithAddress;
    let bob: SignerWithAddress;

    const REQUEST_AMOUNT = ethers.parseUnits("1000", 18);
    const MAX_SUPPLY = ethers.parseUnits("10000000", 18);
    const ONE_DAY = 24 * 60 * 60;

    beforeEach(async () => {
        [owner, alice, bob] = await ethers.getSigners();
        const Factory = await ethers.getContractFactory("BelzToken");
        token = (await Factory.deploy()) as BelzToken;
        await token.waitForDeployment();
    });

    // ─────────────────────────────────────────────
    // 1. Deployment
    // ─────────────────────────────────────────────
    describe("Deployment", () => {
        it("sets correct name, symbol and decimals", async () => {
            expect(await token.name()).to.equal("Belz");
            expect(await token.symbol()).to.equal("BLZ");
            expect(await token.decimals()).to.equal(18);
        });

        it("sets deployer as owner", async () => {
            expect(await token.owner()).to.equal(owner.address);
        });

        it("starts with zero total supply", async () => {
            expect(await token.totalSupply()).to.equal(0);
        });

        it("has correct MAX_SUPPLY and REQUEST_AMOUNT constants", async () => {
            expect(await token.MAX_SUPPLY()).to.equal(MAX_SUPPLY);
            expect(await token.REQUEST_AMOUNT()).to.equal(REQUEST_AMOUNT);
        });
    });

    // ─────────────────────────────────────────────
    // 2. Owner Mint
    // ─────────────────────────────────────────────
    describe("mint()", () => {
        it("owner can mint tokens to any address", async () => {
            await token.connect(owner).mint(alice.address, REQUEST_AMOUNT);
            expect(await token.balanceOf(alice.address)).to.equal(REQUEST_AMOUNT);
            expect(await token.totalSupply()).to.equal(REQUEST_AMOUNT);
        });

        it("emits Mint and Transfer events on mint", async () => {
            await expect(token.connect(owner).mint(alice.address, REQUEST_AMOUNT))
                .to.emit(token, "Mint").withArgs(alice.address, REQUEST_AMOUNT)
                .and.to.emit(token, "Transfer").withArgs(ethers.ZeroAddress, alice.address, REQUEST_AMOUNT);
        });

        it("reverts if non-owner tries to mint", async () => {
            await expect(token.connect(alice).mint(alice.address, REQUEST_AMOUNT))
                .to.be.revertedWith("Only owner");
        });

        it("reverts if minting would exceed MAX_SUPPLY", async () => {
            await expect(token.connect(owner).mint(alice.address, MAX_SUPPLY + 1n))
                .to.be.revertedWith("Max supply exceeded");
        });
    });

    // ─────────────────────────────────────────────
    // 3. Faucet — requestToken
    // ─────────────────────────────────────────────
    describe("requestToken()", () => {
        it("sends REQUEST_AMOUNT to caller and emits TokensRequested", async () => {
            const tx = await token.connect(alice).requestToken();
            const receipt = await tx.wait();
            const block = await ethers.provider.getBlock(receipt!.blockNumber);

            await expect(tx)
                .to.emit(token, "TokensRequested")
                .withArgs(alice.address, REQUEST_AMOUNT, block!.timestamp);

            expect(await token.balanceOf(alice.address)).to.equal(REQUEST_AMOUNT);
        });

        it("updates lastRequestTime after claim", async () => {
            await token.connect(alice).requestToken();
            const lastRequest = await token.lastRequestTime(alice.address);
            expect(lastRequest).to.be.gt(0);
        });

        it("reverts if user requests again before 24h cooldown", async () => {
            await token.connect(alice).requestToken();
            await expect(token.connect(alice).requestToken())
                .to.be.revertedWith("Can only request once every 24 hours");
        });

        it("allows request again after 24h cooldown", async () => {
            await token.connect(alice).requestToken();
            await time.increase(ONE_DAY);
            await expect(token.connect(alice).requestToken()).to.not.be.reverted;
            expect(await token.balanceOf(alice.address)).to.equal(REQUEST_AMOUNT * 2n);
        });
    });

    // ─────────────────────────────────────────────
    // 4. canRequest / timeUntilNextRequest
    // ─────────────────────────────────────────────
    describe("View functions", () => {
        it("canRequest returns true for fresh address", async () => {
            expect(await token.canRequest(alice.address)).to.be.true;
        });

        it("canRequest returns false immediately after claim", async () => {
            await token.connect(alice).requestToken();
            expect(await token.canRequest(alice.address)).to.be.false;
        });

        it("timeUntilNextRequest returns 0 for fresh address", async () => {
            expect(await token.timeUntilNextRequest(alice.address)).to.equal(0);
        });

        it("timeUntilNextRequest returns remaining seconds after claim", async () => {
            await token.connect(alice).requestToken();
            const remaining = await token.timeUntilNextRequest(alice.address);
            expect(remaining).to.be.gt(0);
            expect(remaining).to.be.lte(ONE_DAY);
        });
    });

    // ─────────────────────────────────────────────
    // 5. Transfer
    // ─────────────────────────────────────────────
    describe("transfer()", () => {
        beforeEach(async () => {
            await token.connect(alice).requestToken();
        });

        it("transfers tokens between accounts", async () => {
            await token.connect(alice).transfer(bob.address, ethers.parseUnits("100", 18));
            expect(await token.balanceOf(bob.address)).to.equal(ethers.parseUnits("100", 18));
            expect(await token.balanceOf(alice.address)).to.equal(ethers.parseUnits("900", 18));
        });

        it("emits Transfer event", async () => {
            const amount = ethers.parseUnits("100", 18);
            await expect(token.connect(alice).transfer(bob.address, amount))
                .to.emit(token, "Transfer").withArgs(alice.address, bob.address, amount);
        });

        it("reverts on insufficient balance", async () => {
            await expect(token.connect(alice).transfer(bob.address, ethers.parseUnits("9999", 18)))
                .to.be.revertedWith("Insufficient balance");
        });

        it("reverts on self transfer", async () => {
            await expect(token.connect(alice).transfer(alice.address, REQUEST_AMOUNT))
                .to.be.revertedWith("Self transfer not allowed");
        });
    });

    // ─────────────────────────────────────────────
    // 6. Approve & transferFrom
    // ─────────────────────────────────────────────
    describe("approve() and transferFrom()", () => {
        const amount = ethers.parseUnits("500", 18);

        beforeEach(async () => {
            await token.connect(alice).requestToken();
            await token.connect(alice).approve(bob.address, amount);
        });

        it("sets allowance correctly", async () => {
            expect(await token.allowance(alice.address, bob.address)).to.equal(amount);
        });

        it("emits Approval event", async () => {
            await expect(token.connect(alice).approve(bob.address, amount))
                .to.emit(token, "Approval").withArgs(alice.address, bob.address, amount);
        });

        it("transferFrom moves tokens and deducts allowance", async () => {
            await token.connect(bob).transferFrom(alice.address, bob.address, amount);
            expect(await token.balanceOf(bob.address)).to.equal(amount);
            expect(await token.allowance(alice.address, bob.address)).to.equal(0);
        });

        it("reverts if transferFrom exceeds allowance", async () => {
            await expect(
                token.connect(bob).transferFrom(alice.address, bob.address, amount + 1n)
            ).to.be.revertedWith("Allowance exceeded");
        });
    });

    // ─────────────────────────────────────────────
    // 7. Burn
    // ─────────────────────────────────────────────
    describe("burn()", () => {
        beforeEach(async () => {
            await token.connect(alice).requestToken();
        });

        it("burns tokens and reduces total supply", async () => {
            const burnAmount = ethers.parseUnits("200", 18);
            await token.connect(alice).burn(burnAmount);
            expect(await token.balanceOf(alice.address)).to.equal(REQUEST_AMOUNT - burnAmount);
            expect(await token.totalSupply()).to.equal(REQUEST_AMOUNT - burnAmount);
        });

        it("emits Transfer to zero address on burn", async () => {
            const burnAmount = ethers.parseUnits("200", 18);
            await expect(token.connect(alice).burn(burnAmount))
                .to.emit(token, "Transfer").withArgs(alice.address, ethers.ZeroAddress, burnAmount);
        });

        it("reverts if burn amount exceeds balance", async () => {
            await expect(token.connect(alice).burn(REQUEST_AMOUNT + 1n))
                .to.be.revertedWith("Insufficient balance");
        });
    });

    // ─────────────────────────────────────────────
    // 8. transferOwnership
    // ─────────────────────────────────────────────
    describe("transferOwnership()", () => {
        it("owner can transfer ownership", async () => {
            await token.connect(owner).transferOwnership(alice.address);
            expect(await token.owner()).to.equal(alice.address);
        });

        it("reverts if non-owner tries to transfer ownership", async () => {
            await expect(token.connect(alice).transferOwnership(bob.address))
                .to.be.revertedWith("Only owner");
        });

        it("reverts if new owner is zero address", async () => {
            await expect(token.connect(owner).transferOwnership(ethers.ZeroAddress))
                .to.be.revertedWith("Zero address");
        });

        it("new owner can mint after ownership transfer", async () => {
            await token.connect(owner).transferOwnership(alice.address);
            await expect(token.connect(alice).mint(bob.address, REQUEST_AMOUNT)).to.not.be.reverted;
        });
    });
});