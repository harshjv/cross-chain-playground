<template>
  <div class="container mt-5 mb-5">
    <h1>Cross-Chain Playground</h1>
    <p class="lead mb-4">@liquality/*</p>
    <div class="">
      <div class="btn-group btn-group-toggle m-2">
        <label :class="{
            'btn btn-primary': true,
            'active': chain === 'btc'
          }">
          <input type="radio" value="btc" autocomplete="off" v-model="chain"> Bitcoin
        </label>
        <label :class="{
            'btn btn-primary': true,
            'active': chain === 'eth'
          }">
          <input type="radio" value="eth" autocomplete="off" v-model="chain"> Ethereum
        </label>
      </div>
      <div class="btn-group btn-group-toggle m-2">
        <label :class="{
            'btn btn-primary': true,
            'active': network === net
          }" v-for="net in chainNetworkNames">
          <input type="radio" :value="net" autocomplete="off" v-model="network"> {{net}}
        </label>
      </div>
      <button :class="{
        'btn btn-primary m-2': true,
        'active': erc20
        }" @click="erc20 = !erc20" v-if="chain === 'eth'">ERC20</button>
      <div class="btn-group btn-group-toggle m-2">
        <label :class="{
            'btn btn-primary': true,
            'active': wallet === w
          }" v-for="w in availableWallets">
          <input type="radio" :value="w" autocomplete="off" v-model="wallet"> {{w}}
        </label>
      </div>
      <div class="btn-group btn-group-toggle m-2" v-if="wallet === 'Ledger'">
        <label :class="{
            'btn btn-primary': true,
            'active': transport === 'usb'
          }">
          <input type="radio" value="usb" autocomplete="off" v-model="transport"> USB
        </label>
        <label :class="{
            'btn btn-primary': true,
            'active': transport === 'ble'
          }">
          <input type="radio" value="ble" autocomplete="off" v-model="transport"> Bluetooth
        </label>
      </div>
      <button class="btn btn-light m-2" @click="resetForm">Clear</button>
    </div>
    <input class="form-control m-2" v-if="chain === 'eth' && erc20" :placeholder="'ERC20 token address on ' + network" v-model="erc20Address" />
    <small class="m-2" v-if="chain === 'eth' && network === 'mainnet' && erc20" @click="erc20Address = '0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359'" style="cursor: pointer">Click here to use ERC20 address of MakerDAO's DAI (0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359)</small>
    <details class="mt-4">
      <summary>Browser / ES6 / ES5 usage</summary>
      <div class="card mt-3">
        <div class="card-body">
          <p class="mb-1"><small class="text-muted">BROWSER</small></p>
          <pre class="m-0"><code>{{importStatements('web')}}</code></pre>
          <hr>
          <p class="mb-1"><small class="text-muted">ES6</small></p>
          <pre class="m-0"><code>{{importStatements('es6')}}</code></pre>
          <hr>
          <p class="mb-1"><small class="text-muted">ES5</small></p>
          <pre class="m-0"><code>{{importStatements('es5')}}</code></pre>
        </div>
      </div>
    </details>
    <div class="card mt-4">
      <div class="card-body">
        <p class="mb-1"><small class="text-muted">CODE</small></p>
        <pre class="mb-3"><code>{{code}}</code></pre>

        <div class="mb-3">
          <button class="btn btn-light" @click="unused"><code>await client.wallet.getUnusedAddress()</code></button> <span v-if="loading[0]" class="ml-3">working...</span>
          <div v-if="result[0]" class="alert alert-success mt-3 mb-0">
            <pre class="m-0"><code>{{result[0]}}</code></pre>
          </div>
        </div>

        <div class="mb-3">
          <button class="btn btn-light" @click="used"><code>await client.wallet.getUsedAddresses()</code></button> <span v-if="loading[1]" class="ml-3">working...</span>
          <div v-if="result[1]" class="alert alert-success mt-3 mb-0">
            <pre class="m-0"><code>{{result[1]}}</code></pre>
          </div>
        </div>
        <div>
          <button class="btn btn-light" @click="balance"><code>await client.chain.getBalance(addresses)</code></button> <span v-if="loading[2]" class="ml-3">working...</span>
          <div v-if="result[2]" class="alert alert-success mt-3 mb-0">
            <pre class="m-0"><code>{{result[2]}}</code></pre>
          </div>
        </div>
      </div>
    </div>

    <div v-if="error" class="card mb-3 text-white bg-danger">
      <div class="card-body">
        <pre class="m-0"><code>{{error}}<hr><small>Check console for more details</small></code></pre>
      </div>
    </div>
  </div>
</template>

<script>
import Client from '@liquality/client'
import BitcoinRpcProvider from '@liquality/bitcoin-bitcore-rpc-provider'
import BitcoinLedgerProvider from '@liquality/bitcoin-ledger-provider'
import BitcoinNetworks from '@liquality/bitcoin-networks'

import EthereumRpcProvider from '@liquality/ethereum-rpc-provider'
import EthereumLedgerProvider from '@liquality/ethereum-ledger-provider'
import EthereumNetworks from '@liquality/ethereum-networks'
import EthereumErc20Provider from '@liquality/ethereum-erc20-provider'
import EthereumMetaMaskProvider from '@liquality/ethereum-metamask-provider'

import { rpcUrls } from '@/utils/rpc'
import { getLibs, getCode, makeLibsImportable } from '@/utils/code'

const RpcProviders = {
  btc: BitcoinRpcProvider,
  eth: EthereumRpcProvider
}

const LedgerProviders = {
  btc: BitcoinLedgerProvider,
  eth: EthereumLedgerProvider
}

const networks = {
  btc: BitcoinNetworks,
  eth: EthereumNetworks
}

const CLIENT_CACHE = {}

const getClient = (chain, networkName, networkObject, transport, wallet, erc20, erc20Address) => {
  const key = chain + networkName + transport + wallet + erc20 + erc20Address

  if (CLIENT_CACHE[key]) return CLIENT_CACHE[key]

  const client = new Client()
  client.addProvider(new RpcProviders[chain](...rpcUrls[chain][networkName]))

  let walletProvider

  if (walletProvider === 'MetaMask' && chain === 'eth') {
    walletProvider = new EthereumMetaMaskProvider(window.web3.currentProvider, networkObject)
  } else {
    walletProvider = new LedgerProviders[chain]({ network: networkObject })
  }

  if (transport === 'ble') walletProvider.useWebBle()
  client.addProvider(walletProvider)

  if (chain === 'eth' && erc20) {
    client.addProvider(new EthereumErc20Provider(erc20Address))
  }

  CLIENT_CACHE[key] = client

  return CLIENT_CACHE[key]
}

const wallets = {
  btc: [ 'Ledger' ],
  eth: [ 'Ledger', 'MetaMask' ]
}

export default {
  name: 'Home',
  data: function () {
    return {
      chain: 'btc',
      transport: 'usb',
      network: 'bitcoin',
      loading: {
        0: false,
        1: false,
        2: false
      },
      result: {
        0: null,
        1: null,
        2: null
      },
      error: false,
      erc20: false,
      erc20Address: null,
      wallet: 'Ledger'
    }
  },
  watch: {
    chain: function () {
      this.resetForm()
      this.network = this.chainNetworkNames[0]
      this.wallet = 'Ledger'
    },
    watchKey: function () {
      this.resetForm()
    }
  },
  computed: {
    availableWallets: function () {
      return wallets[this.chain]
    },
    selectedNetworkObject: function () {
      return networks[this.chain][this.network]
    },
    selectedChainNetworksObject: function () {
      return networks[this.chain]
    },
    chainNetworkNames: function () {
      return Object.keys(this.selectedChainNetworksObject).filter(n => n !== 'version' && !n.startsWith('classic'))
    },
    cl: function () {
      return getClient(this.chain, this.network, this.selectedNetworkObject, this.transport, this.wallet, this.erc20, this.erc20Address)
    },
    watchKey: function () {
      return this.network + this.transport
    },
    libs: function () {
      return getLibs(this.chain, this.transport, this.wallet, this.erc20)
    },
    code: function () {
      return getCode(this.libs, this.chain, this.network, this.transport, this.erc20Address)
    }
  },
  methods: {
    importStatements: function (type) {
      return makeLibsImportable(this.libs, type)
    },
    resetForm: function () {
      this.loading = {
        0: false,
        1: false,
        2: false
      }
      this.result = {
        0: null,
        1: null,
        2: null
      }
      this.error = false
    },
    unused: async function () {
      this.loading[0] = true

      this.$nextTick(async () => {
        try {
          this.error = false
          this.result[0] = JSON.stringify(await this.cl.wallet.getUnusedAddress(), null, 2)
        } catch (e) {
          console.error(e)
          this.error = e.toString()
        }

        this.loading[0] = false
      })
    },
    used: async function () {
      this.loading[1] = true

      this.$nextTick(async () => {
        try {
          this.error = false
          this.result[1] = JSON.stringify(await this.cl.wallet.getUsedAddresses(), null, 2)
        } catch (e) {
          console.error(e)
          this.error = e.toString()
        }

        this.loading[1] = false
      })
    },
    balance: async function () {
      this.loading[2] = true

      this.$nextTick(async () => {
        try {
          this.error = false
          const addresses = await this.cl.wallet.getUsedAddresses()
          this.result[2] = JSON.stringify(await this.cl.chain.getBalance(addresses), null, 2)
        } catch (e) {
          console.error(e)
          this.error = e.toString()
        }

        this.loading[2] = false
      })
    }
  }
}
</script>

<style lang="scss">
button {
  code, pre {
    color: inherit;
  }
}
.text-white {
  code, pre {
    color: inherit;
  }
}
.btn {
  text-align: left!important;
}
</style>
