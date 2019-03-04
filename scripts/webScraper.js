const rp = require('request-promise');
const $ = require('cheerio');
const urls = [
  'https://etherscan.io/token/generic-tokenholders2?m=normal&a=0xef3288934a34adcb5d31a9da66aa44d56a2d4309&s=100000000000000000',
  'https://etherscan.io/token/generic-tokenholders2?a=0xef3288934a34adcb5d31a9da66aa44d56a2d4309&m=normal&s=1E%2b17&p=2'
]
const fs = require('fs');

urls.forEach(async (url) => {
  let html = await rp(url)
    .catch(console.error);
  const rawArray = $('tr > td > span > a', html).text();
  console.log(rawArray)
  addressArray = rawArray.split('0x').map((address) => {
    return `"0x${address}"`;
  })
  fs.appendFileSync('addresses.js', addressArray)
})