require('dotenv').config();
const {
  INFURA_ENDPOINT,
  ADMIN_ADDRESS
} = process.env;

const AirdropService = require('../services/ethereum/AirdropService');
const as = new AirdropService();
const holders = require('../holders')

async function main() {
  try {
    // // get all token Transfer events
    // const transferEvents = await eth.getPastEvents('Transfer');
    // console.log("Transfer Events: ", transferEvents);
    // // parse out the unique user addresses
    // const fromAddresses = transferEvents.map((event) => {
    //   return event.returnValues.from;
    // })
    // const toAddresses = transferEvents.map((event) => {
    //   return event.returnValues.to;
    // })

    // const allAddresses = [...toAddresses, ...fromAddresses]
    // console.log(allAddresses)

    // const allUniqueAddresses = [...new Set(allAddresses)];
    // console.log(allUniqueAddresses);

    // create array of address => balance objects for snapshot
    console.log("Address => Balance pairs ", addressBalanceArray);
    // create a snapshot of the addresses => balances and write to file
    let balance1 = await as.getTokenBalance(holders[0]);

    console.log('Balance1: ', balance1)
    let tx = await as.airdropToken(holders[0], '100000');
    console.log("Tx: ", tx);
    let balance2 = await as.getTokenBalance(holders[0]);
    console.log('Balance2: ', balance2)
  } catch (error) {
    console.error(error)
  }
}

main()