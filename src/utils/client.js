import Client from '@liquality/client'

import BitcoinRpcProvider from '@liquality/bitcoin-bitcore-rpc-provider'
import BitcoinLedgerProvider from '@liquality/bitcoin-ledger-provider'
import BitcoinSwapProvider from '@liquality/bitcoin-swap-provider'

import EthereumRpcProvider from '@liquality/ethereum-rpc-provider'
import EthereumLedgerProvider from '@liquality/ethereum-ledger-provider'
import EthereumErc20Provider from '@liquality/ethereum-erc20-provider'
import EthereumMetaMaskProvider from '@liquality/ethereum-metamask-provider'
import EthereumSwapProvider from '@liquality/ethereum-swap-provider'
import EthereumErc20SwapProvider from '@liquality/ethereum-erc20-swap-provider'

import { rpcUrls } from '@/utils/rpc'
import { networks } from '@/utils/networks'

const CLIENT_CACHE = {}

const RpcProviders = {
  btc: BitcoinRpcProvider,
  eth: EthereumRpcProvider
}

const LedgerProviders = {
  btc: BitcoinLedgerProvider,
  eth: EthereumLedgerProvider
}

export const getClient = (chain, network, transport, wallet, erc20, erc20Address, atomicSwap) => {
  const key = chain + network + transport + wallet + erc20 + erc20Address + atomicSwap

  if (CLIENT_CACHE[key]) return CLIENT_CACHE[key]

  const client = new Client()
  client.addProvider(new RpcProviders[chain](...rpcUrls[chain][network]))

  let walletProvider

  if (walletProvider === 'MetaMask' && chain === 'eth') {
    walletProvider = new EthereumMetaMaskProvider(window.web3.currentProvider, networks[chain][network])
  } else {
    walletProvider = new LedgerProviders[chain]({ network: networks[chain][network] })
  }

  if (transport === 'ble') walletProvider.useWebBle()
  client.addProvider(walletProvider)

  if (chain === 'eth') {
    if (erc20 === 'true') {
      client.addProvider(new EthereumErc20Provider(erc20Address))

      if (atomicSwap === 'true') {
        client.addProvider(new EthereumErc20SwapProvider())
      }
    } else {
      if (atomicSwap === 'true') {
        client.addProvider(new EthereumSwapProvider())
      }
    }
  } else {
    if (atomicSwap === 'true') {
      client.addProvider(new BitcoinSwapProvider(networks[chain][network]))
    }
  }

  CLIENT_CACHE[key] = client

  return CLIENT_CACHE[key]
}
