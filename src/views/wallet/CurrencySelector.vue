<template>
  <div class="text-center">
    <h2>Select your currency</h2>
    <p class="lead">To view balance &amp; send transactions</p>
    <div class="row justify-content-center mb-4">
      <div class="col-md-4" v-for="c in currencies" :key="c.name">
        <div :class="{
            'card mt-3 mb-3 clickable': true,
            'grayout': currency && c.name !== currency.name
          }" @click="currency = c; network = false">
          <div class="card-body">
            <h2 class="h5 mb-0">{{c.ticker}}</h2>
          </div>
        </div>
      </div>
    </div>
    <div class="mb-4" v-if="currency">
      <p class="lead mb-1">Which {{currency.name}} network would you like to connect to?</p>
      <div class="row justify-content-center">
        <div class="col-md-3" v-for="n in networks" :key="n">
          <div :class="{
            'card mt-3 mb-3 clickable': true,
            'grayout': network && network !== n
          }" @click="selectNetwork(n)">
            <div class="card-body">
              <h2 class="h5 mb-0">{{n | pretty}}</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="currency && network">
      <p class="lead mb-1">Which {{currency.name}} address type would you like to use?</p>
      <div class="row justify-content-center">
        <div class="col-md-3" v-for="n in addressTypes" :key="n">
          <div class="card mt-3 mb-3 clickable" @click="next(n)">
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
import { addressTypes } from '@/utils/addressTypes'
import { currencies } from '@/utils/currency'

export default {
  mixins: [ filters ],
  data: function () {
    return {
      currency: false,
      network: false
    }
  },
  computed: {
    currencies: function () {
      return currencies
    },
    networks: function () {
      const networks = getNetworkNames(this.currency.chain)

      if (this.currency.id.includes('erc20')) {
        return [ 'mainnet' ]
      }

      return networks
    },
    addressTypes: function () {
      return addressTypes[this.currency.chain]
    }
  },
  methods: {
    selectNetwork: function (n) {
      this.network = n

      if (this.addressTypes.length === 1) {
        this.next(this.addressTypes[0])
      }
    },
    next: function (addressType) {
      this.$router.push({
        name: 'currency_network_wallet',
        params: { id: this.currency.id, network: this.network, addressType }
      })
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
