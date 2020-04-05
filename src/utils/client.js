import Client from '@liquality/client'

import BitcoinEsploraApiProvider from '@liquality/bitcoin-esplora-api-provider'
import BitcoinLedgerProvider from '@liquality/bitcoin-ledger-provider'

import EthereumRpcProvider from '@liquality/ethereum-rpc-provider'
import EthereumLedgerProvider from '@liquality/ethereum-ledger-provider'
import EthereumMetaMaskProvider from '@liquality/ethereum-metamask-provider'
import EthereumErc20Provider from '@liquality/ethereum-erc20-provider'

import { networks } from '@/utils/networks'
import { getDefaultRpcConfig } from '@/utils/rpc'

const CLIENT_CACHE = {}

const RpcProviders = {
  btc: BitcoinEsploraApiProvider,
  eth: EthereumRpcProvider
}

const LedgerProviders = {
  btc: BitcoinLedgerProvider,
  eth: EthereumLedgerProvider
}

export const getClient = (chain, network, wallet, transport, addressType, erc20) => {
  wallet = wallet.toLowerCase()

  const key = chain + network + transport + wallet + addressType + erc20
  if (CLIENT_CACHE[key]) return CLIENT_CACHE[key]

  const client = new Client()
  client.addProvider(new RpcProviders[chain](...getDefaultRpcConfig(chain, network)))

  let walletProvider

  if (wallet.match(/metamask/)) {
    walletProvider = new EthereumMetaMaskProvider(window.web3.currentProvider, networks[chain][network])
  } else {
    const args = [{ network: networks[chain][network] }]

    if (chain === 'btc') {
      args.push(addressType)
    }

    walletProvider = new LedgerProviders[chain](...args)
  }

  if (transport === 'ble') walletProvider.useWebBle()
  client.addProvider(walletProvider)

  if (chain === 'eth') {
    if (erc20) {
      client.addProvider(new EthereumErc20Provider(erc20))
    }
  }

  CLIENT_CACHE[key] = client

  return CLIENT_CACHE[key]
}
