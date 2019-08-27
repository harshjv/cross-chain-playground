import BitcoinNetworks from '@liquality/bitcoin-networks'
import EthereumNetworks from '@liquality/ethereum-networks'

export const networks = {
  btc: {
    ...BitcoinNetworks,
    bitcoin_regtest: {
      name: 'bitcoin_testnet',
      pubKeyHash: '6F',
      scriptHash: 'C4',
      coinType: '1',
      explorerUrl: 'https://testnet.blockchain.info',
      wif: 0xef,
      bip32: {
        public: 0x043587cf,
        private: 0x04358394
      },
      isTestnet: true
    }
  },
  eth: {
    ...EthereumNetworks,
    local: undefined
  }
}

export const getNetworkNames = (chain) => {
  return Object.keys(networks[chain]).filter(n => n !== 'version' && !n.startsWith('classic'))
}

export const getDefaultNetworkName = (chain) => {
  return getNetworkNames(chain)[0]
}

export const checkOrDefaultNetwork = (chain, network) => {
  if (network && networks[chain][network]) {
    return network
  }

  return getDefaultNetworkName(chain)
}

export const checkNetwork = (chain, network) => network && networks[chain][network]
