<template>
  <div>
    <div class="text-center" v-if="!transport">
      <h2>{{currency.ticker}} on {{network | pretty}}</h2>
      <p class="lead">Select your wallet</p>
      <div class="row justify-content-center mb-4">
        <div class="col-md-4" v-for="w in wallets">
          <div :class="{
              'card mt-3 mb-3 clickable': true,
              'grayout': wallet && w.name !== wallet.name
            }" @click="selectWallet(w)">
            <div class="card-body ">
              <h2 class="h5 mb-0">{{w.name}}</h2>
            </div>
          </div>
        </div>
      </div>
      <div v-if="wallet">
        <p class="lead mb-1">How would you like to connect your {{wallet.name}}?</p>
        <div class="row justify-content-center">
          <div class="col-md-3" v-for="transport in transports">
            <div class="card mt-3 mb-3 clickable" @click="selectTransport(transport)">
              <div class="card-body">
                <h2 class="h5 mb-0">{{transport | pretty}}</h2>
              </div>
            </div>
          </div>
        </div>
      </div>
      <p><router-link :to="{ path: '/wallet' }" class="small label">&larr; Go back</router-link></p>
    </div>
    <Wallet v-else :currency="currency" :wallet="wallet" :network="network" :transport="transport" />
  </div>
</template>

<script>
import filters from '@/mixins/filters'
import { findCurrency, findWallets } from '@/utils/currency'
import ErrorComp from '@/components/Error'
import Wallet from '@/components/Wallet'

export default {
  mixins: [ filters ],
  components: {
    ErrorComp,
    Wallet
  },
  data: function () {
    return {
      currency: null,

      network: null,
      wallet: null,
      transport: null,

      wallets: [],
      transports: []
    }
  },
  created: function () {
    const { id, network } = this.$route.params

    this.network = network
    this.currency = findCurrency(id)
    this.wallets = findWallets(this.currency.chain)
  },
  methods: {
    selectWallet: function (wallet) {
      this.wallet = wallet
      this.transports = wallet.transports
    },
    selectTransport: function (transport) {
      this.transport = transport
    }
  }
}
</script>
