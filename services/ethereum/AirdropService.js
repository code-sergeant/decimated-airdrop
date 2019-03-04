require('dotenv').config();
const {
  INFURA_ENDPOINT,
  ADMIN_ADDRESS,
  ADMIN_PRIVATEKEY,
  DEPLOYED_ADDRESS
} = process.env;
const ERC20_ABI = require("../../build/contracts/IERC20.json").abi
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider(INFURA_ENDPOINT));

class AirdropService {
  constructor(prevTokenAddress, newTokenAddress) {
    this.web3 = web3;
    this.prevTokenAddress = prevTokenAddress;
    this.newTokenAddress = newTokenAddress;
  }

  getERC20Instance(tokenAddress) {
    return new web3.eth.Contract(ERC20_ABI, tokenAddress);
  }

  async getTokenBalance(tokenAddress, userAddress) {
    try {
      const ERC20 = this.getERC20Instance(tokenAddress);
      console.log(`Running getTokenBalance on address ${userAddress}`);
      let balance = await ERC20.methods.balanceOf(userAddress).call({
        from: ADMIN_ADDRESS
      });
      return balance;
    } catch (error) {
      console.error(error);
    }
  }

  async airdropToken(balanceMap) {
    try {
      const newERC20 = this.getERC20Instance(this.newTokenAddress);

      console.log(`Airdropping token to address ${balanceMap.address}`);

      this.web3.eth.accounts.wallet.add(ADMIN_PRIVATEKEY);
      let tx = await newERC20.methods
        .transfer(balanceMap.address, balanceMap.balance)
        .send({
          from: ADMIN_ADDRESS,
          gas: "60000",
          gasPrice: "10000000000"
        })

      return tx;
    } catch (error) {
      console.error("Error in airdopToken(): ", error);
    }
  }

  // Step one: Create a balance mapping to all the addresses in the array you provide for airdropping.  
  async getBalanceMapping(tokenAddress, addressArray) {
    const balanceMapping = await Promise.all(addressArray.map(async (address) => {
      try {
        const balance = await this.getTokenBalance(tokenAddress, address);
        return {
          address,
          balance
        };
      } catch (error) {
        console.error(`Error while mapping address ${address} `)
        return {
          address,
          balance: null
        }
      }
    }))
    return balanceMapping;
  }

  // Step 2: Airdrop the balance of the previous token address to the new address. Store the 
  async airdropToAddressArray(balanceMapping) {
    console.log("Address => Balance pairs ", balanceMapping);
    for (let i = 0; i < balanceMapping.length; i++) {
      const {
        address,
        balance
      } = addressArray[i];

      try {
        let tx = await this.airdropToken(address, balance);
        let success = {
          address,
          balance,
          success: true,
          tx
        }
        fs.appendFileSync('airdrop.js', success)
        return success;
      } catch (error) {
        console.error(`Error in airdropToAddressArray at address ${address}`)
        let failed = {
          address,
          balance,
          success: false,
          tx: null
        }
        fs.appendFileSync('airdrop.js', failed)
        return failed;
      }
    }
  }

  async getPastEvents(tokenAddress, eventName = '', filter = {}, fromBlock = 0, toBlock = 'latest') {
    try {
      const ERC20 = this.getERC20Instance(tokenAddress);
      console.log(`Running getPastEvents from event ${eventName}`);
      let pastEvents = await ERC20.getPastEvents(eventName, {
        filter,
        fromBlock,
        toBlock
      })
      return pastEvents;
    } catch (error) {
      console.error(error)
    }
  }

}

module.exports = AirdropService;