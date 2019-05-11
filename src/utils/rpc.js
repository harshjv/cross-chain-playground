const rpcUrls = {
  btc: {
    bitcoin: [ 'https://liquality.io/bitcoinrpc/', 'liquality', 'liquality123' ],
    bitcoin_testnet: [ 'https://liquality.io/bitcointestnetrpc/', 'bitcoin', 'local321' ]
  },
  eth: {
    mainnet: [ 'https://mainnet.infura.io/v3/da99ebc8c0964bb8bb757b6f8cc40f1f' ],
    ropsten: [ 'https://ropsten.infura.io/v3/da99ebc8c0964bb8bb757b6f8cc40f1f' ],
    rinkeby: [ 'https://rinkeby.infura.io/v3/da99ebc8c0964bb8bb757b6f8cc40f1f' ],
    kovan: [ 'https://kovan.infura.io/v3/da99ebc8c0964bb8bb757b6f8cc40f1f' ]
  }
}

export {
  rpcUrls
}
