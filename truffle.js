require('dotenv').config();
const {
  MNEMONIC,
  API_KEY
} = process.env
const HDWalletProvider = require('truffle-hdwallet-provider');

module.exports = {
  networks: {
    rinkeby: {
      provider: function () {
        return new HDWalletProvider(MNEMONIC, `https://rinkeby.infura.io/${API_KEY}`);
      },
      network_id: "*"
    },
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*",
    }
  }
}