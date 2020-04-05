<template>
  <div class="toolbar">
    <ul class="nav nav-pills flex-column mb-4">
      <li class="nav-item">
        <span class="nav-link small">Chain</span>
      </li>
      <li class="nav-item" v-for="c in chains" :key="c.name">
        <span :class="{
            'nav-link': true,
            'active': chain === c.short
          }" @click="chain = c.short">{{c.name}}</span>
      </li>
    </ul>

    <ul class="nav nav-pills flex-column mb-4">
      <li class="nav-item">
        <span class="nav-link small">Network</span>
      </li>
      <li class="nav-item" v-for="net in networkNames" :key="net">
        <span :class="{
            'nav-link': true,
            'active': network === net
          }" @click="network = net">{{net | pretty}}</span>
      </li>
    </ul>

    <ul class="nav nav-pills flex-column mb-4">
      <li class="nav-item">
        <span class="nav-link small">Wallet</span>
      </li>
      <li class="nav-item" v-for="w in availableWallets" :key="w">
        <span :class="{
            'nav-link': true,
            'active': wallet === w
          }" @click="wallet = w">{{w | pretty}}</span>
      </li>
    </ul>

    <ul class="nav nav-pills flex-column mb-4" v-if="wallet === 'ledger'">
      <li class="nav-item">
        <span class="nav-link small">Transport</span>
      </li>
      <li class="nav-item" v-for="t in [ 'usb', 'ble' ]" :key="t">
        <span :class="{
            'nav-link': true,
            'active': transport === t
          }" @click="transport = t">Web {{t.toUpperCase()}}</span>
      </li>
    </ul>

    <ul class="nav nav-pills flex-column mb-4" v-if="chain === 'eth'">
      <li class="nav-item">
        <span class="nav-link small">Token</span>
      </li>
      <li class="nav-item">
        <span :class="{
            'nav-link': true,
            'active': erc20
          }" @click="erc20 ? erc20 = false : erc20 = '0x89d24A6b4CcB1B6fAA2625fE562bDD9a23260359'">DAI</span>
      </li>
    </ul>

    <ul class="nav nav-pills flex-column mb-4" v-if="wallet === 'ledger'">
      <li class="nav-item">
        <span class="nav-link small">Address Type</span>
      </li>
      <li class="nav-item" v-for="t in availableAddressTypes" :key="t">
        <span :class="{
            'nav-link': true,
            'active': addressType === t
          }" @click="addressType = t">{{t | pretty}}</span>
      </li>
    </ul>

    <!-- <ul class="nav nav-pills flex-column mb-4">
      <li class="nav-item">
        <span class="nav-link small">Experiment 🧪</span>
      </li>
      <li class="nav-item">
        <span :class="{
            'nav-link': true,
            'active': atomicSwap === 'true'
          }" @click="atomicSwap === 'true' ? atomicSwap = '' : atomicSwap = 'true'">Atomic Swap</span>
      </li>
    </ul> -->
  </div>
</template>

<script>
import {
  getNetworkNames
} from '@/utils/networks'
import {
  wallets
} from '@/utils/wallets'
import {
  addressTypes
} from '@/utils/addressTypes'
import { mapQs } from '@/mixins/map'
import filters from '@/mixins/filters'

export default {
  name: 'Home',
  mixins: [
    filters,
    mapQs([ 'chain', 'network', 'wallet', 'transport', 'addressType', 'erc20', 'atomicSwap' ])
  ],
  computed: {
    chains: function () {
      return [
        {
          name: 'Bitcoin',
          short: 'btc'
        },
        {
          name: 'Ethereum',
          short: 'eth'
        }
      ]
    },
    availableWallets: function () {
      return wallets[this.chain]
    },
    networkNames: function () {
      return getNetworkNames(this.chain)
    },
    availableAddressTypes: function () {
      return addressTypes[this.chain]
    }
  }
}
</script>

<style lang="scss">
.toolbar {
  .nav-link.small {
    text-transform: uppercase;
  }
}

.nav-link {
  padding: 0.3rem 0.8rem;
  @extend .text-muted;

  &:not(.small) {
    cursor: pointer;
  }

  &.active {
    color: $primary!important;
    background-color: transparent!important;
    font-weight: 500;

    &:after {
      display: inline;
      content: '✓';
      margin-left: 5px;
      font-size: 90%;
    }
  }
}
</style>
