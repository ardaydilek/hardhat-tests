// function deployFunc() {
//     console.log('deploying contract');
// }

// module.exports.default = deployFunc;

const { networkConfig, developmentChain } = require("../helper-hardhat-config");
const { verify } = require("../utils/verify.js");

module.exports = async ({
  getNamedAccounts,
  deployments,
  getChainId,
  getUnnamedAccounts,
}) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = await getChainId();

  // if chainId is X use address Y
  // if chainId is Z use address A

  // const ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"];
  let ethUsdPriceFeedAddress;
  if (developmentChain.includes(network.name)) {
    const ethUsdAggregator = await deployments.get("MockV3Aggregator");
    ethUsdPriceFeedAddress = ethUsdAggregator.address;
  } else {
    ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"];
  }

  // if the contract doens't exist, we deploy a minimal verison of it for our local testing.

  // well what happens when we want to change chains?
  // when going for localhost or hardhat network we want to use a mock

  const args = [ethUsdPriceFeedAddress];
  const fundMe = await deploy("FundMe", {
    from: deployer,
    args: args, // put price feed
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  });
  if (!developmentChain.includes(network.name) && process.env.ETHERSCAN_API) {
    console.log(verify);
    await verify(fundMe.address, args);
  }
  log("------------------------------");
};

module.exports.tags = ["all", "fundme"];
