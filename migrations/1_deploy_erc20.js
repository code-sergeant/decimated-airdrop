var ERC20 = artifacts.require("DecimatedERC20");

module.exports = function (deployer) {
  deployer.deploy(ERC20);
};