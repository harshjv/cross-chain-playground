<template>
  <div class="text-center">
    <h2>Select your currency</h2>
    <p class="lead">To view balance &amp; send transactions</p>
    <div class="row justify-content-center mb-4">
      <div class="col-md-4" v-for="c in currencies">
        <div :class="{
            'card mt-3 mb-3 clickable': true,
            'grayout': currency && c.name !== currency.name
          }" @click="selectCurrency(c)">
          <div class="card-body">
            <h2 class="h5 mb-0">{{c.ticker}}</h2>
          </div>
        </div>
      </div>
    </div>
    <div v-if="networks">
      <p class="lead mb-1">Which {{currency.name}} network would you like to connect to?</p>
      <div class="row justify-content-center">
        <div class="col-md-3" v-for="n in networks">
          <div class="card mt-3 mb-3 clickable" @click="selectNetwork(n)">
            <div class="card-body">
              <h2 class="h5 mb-0">{{n | pretty}}</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import filters from '@/mixins/filters'
import { getNetworkNames } from '@/utils/networks'
import { currencies } from '@/utils/currency'

export default {
  mixins: [ filters ],
  data: function () {
    return {
      currency: false,
      networks: false
    }
  },
  computed: {
    currencies: function () {
      return currencies
    }
  },
  methods: {
    selectCurrency: function (currency) {
      this.currency = currency
      this.networks = getNetworkNames(currency.chain)

      if (this.currency.id.includes('erc20')) {
        this.networks = [ 'mainnet' ]
      }
    },
    selectNetwork: function (network) {
      this.$router.push({ name: 'currency_network_wallet', params: { id: this.currency.id, network } })
    }
  }
}
</script>

<style lang="scss">
.no-link {
  text-decoration: none;

  &:hover, &:focus, &:active {
    text-decoration: none;
  }
}
</style>
