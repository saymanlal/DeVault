// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MockToken
 * @notice Simple ERC20 token for testing DeVault
 * @dev Used for testnet deployment and local testing
 */
contract MockToken is ERC20, Ownable {
    uint8 private _decimals;

    /**
     * @notice Constructor that mints initial supply to deployer
     * @param name Token name
     * @param symbol Token symbol
     * @param decimals_ Number of decimals
     * @param initialSupply Initial supply to mint (in token units, not wei)
     */
    constructor(
        string memory name,
        string memory symbol,
        uint8 decimals_,
        uint256 initialSupply
    ) ERC20(name, symbol) Ownable(msg.sender) {
        _decimals = decimals_;
        _mint(msg.sender, initialSupply * (10 ** decimals_));
    }

    /**
     * @notice Returns the number of decimals
     */
    function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }

    /**
     * @notice Mint new tokens (owner only)
     * @param to Recipient address
     * @param amount Amount to mint (in wei)
     */
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    /**
     * @notice Burn tokens from caller
     * @param amount Amount to burn (in wei)
     */
    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }

    /**
     * @notice Faucet function for testnet (anyone can get tokens)
     * @dev Mints 1000 tokens to caller
     */
    function faucet() external {
        _mint(msg.sender, 1000 * (10 ** _decimals));
    }
}
