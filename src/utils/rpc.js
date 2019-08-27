export const rpcUrls = {
  btc: {
    bitcoin: [ 'https://liquality.io/bitcoinrpc/', 'liquality', 'liquality123' ],
    bitcoin_testnet: [ 'https://liquality.io/bitcointestnetrpc/', 'bitcoin', 'local321' ],
    bitcoin_regtest: [ 'http://localhost:4321/bitcoind/', 'bitcoin', 'local321' ]
  },
  eth: {
    mainnet: [ 'https://mainnet.infura.io/v3/da99ebc8c0964bb8bb757b6f8cc40f1f' ],
    ropsten: [ 'https://ropsten.infura.io/v3/da99ebc8c0964bb8bb757b6f8cc40f1f' ],
    rinkeby: [ 'https://rinkeby.infura.io/v3/da99ebc8c0964bb8bb757b6f8cc40f1f' ],
    kovan: [ 'https://kovan.infura.io/v3/da99ebc8c0964bb8bb757b6f8cc40f1f' ],
    local: [ 'http://localhost:8545' ]
  }
}

export const checkRpc = (chain, network, rpc) => {
  if (!rpc) return false

  return true

  // return rpcUrls[chain][network] && rpcUrls[chain][network][0] === rpc
}

export const getDefaultRpc = (chain, network) => {
  return rpcUrls[chain][network]
}
