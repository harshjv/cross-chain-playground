import BitcoinNetworks from '@liquality/bitcoin-networks'
import EthereumNetworks from '@liquality/ethereum-networks'

export const networks = {
  btc: BitcoinNetworks,
  eth: EthereumNetworks
}

export const getNetworkNames = (chain) => {
  return Object.keys(networks[chain]).filter(key => key !== 'version' && !key.startsWith('classic') && !key.endsWith('regtest') && key !== 'local')
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
