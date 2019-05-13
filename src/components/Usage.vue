<template>
  <div>
    <details :open="!okay" class="mb-3">
      <summary>Config <small class="label" v-if="okay">&check;</small></summary>
      <div class="card mt-3">
        <div class="card-body">
          <div v-if="chain === 'btc'">
            <p class="mb-2"><small class="label">BITCOIN BITCORE NODE</small></p>
            <form>
              <div class="form-group">
                <label for="btcRpc">Address <span class="text-primary">*</span></label>
                <input v-model="btcRpcModel" autocomplete="off" type="text" class="form-control" id="btcRpc" aria-describedby="btcRpcHelp" placeholder="https://btcrpc.com/">
                <small id="btcRpcHelp" class="form-text text-muted">Depending on your selection, RPC queries will be made to this node.</small>
              </div>
              <div class="form-group">
                <label for="btcRpcUser">Username</label>
                <input v-model="btcRpcUserModel" autocomplete="off" type="text" class="form-control" id="btcRpcUser" placeholder="bitcoin">
              </div>
              <div class="form-group">
                <label for="btcRpcUser">Password</label>
                <input v-model="btcRpcPassModel" autocomplete="off" type="text" class="form-control" id="btcRpcUser" placeholder="local321">
              </div>
            </form>
          </div>
          <div v-if="chain === 'eth'">
            <p class="mb-2"><small class="label">ETHEREUM GETH/PARITY NODE</small></p>
            <form>
              <div class="form-group">
                <label for="ethRpc">Address <span class="text-primary">*</span></label>
                <input v-model="ethRpcModel" autocomplete="off" type="text" class="form-control" id="ethRpc" aria-describedby="ethRpcHelp" placeholder="https://ethrpc.com/">
                <small id="ethRpcHelp" class="form-text text-muted">Depending on your selection, RPC queries will be made to this node.</small>
              </div>
            </form>
            <div v-if="erc20 === 'true'">
              <p class="mb-2"><small class="label">ERC-20</small></p>
              <form>
                <div class="form-group">
                  <label for="ethErc20">Contract Address on {{network | pretty}} network <span class="text-primary">*</span></label>
                  <input v-model="erc20AddressModel" autocomplete="off" type="text" class="form-control" id="ethErc20" aria-describedby="ethErc20Help" placeholder="0x...">
                  <small v-if="chain === 'eth' && network === 'mainnet'" id="ethErc20Help" class="form-text text-muted clickable" @click="erc20AddressModel = '0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359'">Click here to quickly use ERC20 address of MakerDAO's DAI (0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359)</small>
                </div>
              </form>
            </div>
          </div>
          <button type="button" class="btn btn-primary" @click="update">Update config</button>
        </div>
      </div>
    </details>
    <details class="mb-3">
      <summary>Browser / ES6 / ES5</summary>
      <div class="card mt-3">
        <div class="card-body">
          <p class="mb-1"><small class="label">BROWSER</small></p>
          <pre class="mb-3"><code v-html="importStatements('web')"></code></pre>
          <hr>
          <p class="mb-1"><small class="label">ES6</small></p>
          <pre class="mb-3"><code v-html="importStatements('es6')"></code></pre>
          <hr>
          <p class="mb-1"><small class="label">ES5</small></p>
          <pre class="m-0"><code v-html="importStatements('es5')"></code></pre>
        </div>
      </div>
    </details>
    <details :open="okay">
      <summary>Usage</summary>
      <div class="card mt-3">
        <div class="card-body">
          <pre class="mb-0"><code v-html="code"></code></pre>
        </div>
      </div>
    </details>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getLibs, getCode, makeLibsImportable } from '@/utils/code'

import { mapQs, wrapLocal } from '@/mixins/map'
import filters from '@/mixins/filters'

export default {
  name: 'Usage',
  data: function () {
    return {
      okay: false
    }
  },
  mixins: [
    filters,
    mapQs([ 'btcRpc', 'btcRpcUser', 'btcRpcPass', 'ethRpc', 'erc20Address' ]),
    wrapLocal([ 'btcRpc', 'btcRpcUser', 'btcRpcPass', 'ethRpc', 'erc20Address' ])
  ],
  computed: {
    ...mapState([ 'chain', 'network', 'transport', 'wallet', 'erc20', 'atomicSwap' ]),
    libs: function () {
      return getLibs(this.chain, this.transport, this.wallet, this.erc20, this.atomicSwap)
    },
    code: function () {
      return getCode(this.libs, this.chain, this.network, this.transport, this.erc20Address, {
        btc: [ this.btcRpc, this.btcRpcUser, this.btcRpcPass ],
        eth: [ this.ethRpc ]
      })
    }
  },
  methods: {
    importStatements: function (type) {
      return makeLibsImportable(this.libs, type)
    },
    update: function () {
      if (this.chain === 'btc') {
        this.btcRpc = this.btcRpcModel
        this.btcRpcUser = this.btcRpcUserModel
        this.btcRpcPass = this.btcRpcPassModel
      } else {
        this.ethRpc = this.ethRpcModel

        if (this.erc20 === 'true') {
          this.erc20Address = this.erc20AddressModel
        }
      }

      this.okay = true
    }
  }
}
</script>
