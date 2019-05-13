<template>
  <div>
    <ul class="nav nav-pills flex-column mb-4">
      <li class="nav-item">
        <span class="nav-link small">CHAIN</span>
      </li>
      <li class="nav-item" v-for="c in chains">
        <span :class="{
            'nav-link': true,
            'active': chain === c.short
          }" @click="chain = c.short">{{c.name}}</span>
      </li>
    </ul>

    <ul class="nav nav-pills flex-column mb-4">
      <li class="nav-item">
        <span class="nav-link small">NETWORK</span>
      </li>
      <li class="nav-item" v-for="net in networkNames">
        <span :class="{
            'nav-link': true,
            'active': network === net
          }" @click="network = net">{{net | pretty}}</span>
      </li>
    </ul>

    <ul class="nav nav-pills flex-column mb-4">
      <li class="nav-item">
        <span class="nav-link small">WALLET</span>
      </li>
      <li class="nav-item" v-for="w in availableWallets">
        <span :class="{
            'nav-link': true,
            'active': wallet === w
          }" @click="wallet = w">{{w | pretty}}</span>
      </li>
      <li class="nav-item">
        <span class="nav-link"><s>Node</s></span>
      </li>
    </ul>

    <ul class="nav nav-pills flex-column mb-4" v-if="chain === 'eth'">
      <li class="nav-item">
        <span class="nav-link small">TOKEN</span>
      </li>
      <li class="nav-item">
        <span :class="{
            'nav-link': true,
            'active': erc20 === 'true'
          }" @click="erc20 === 'true' ? erc20 = '' : erc20 = 'true'">ERC-20</span>
      </li>
      <li class="nav-item">
        <span class="nav-link"><s>ERC-721</s></span>
      </li>
    </ul>

    <ul class="nav nav-pills flex-column mb-4" v-if="wallet === 'ledger'">
      <li class="nav-item">
        <span class="nav-link small">TRANSPORT</span>
      </li>
      <li class="nav-item" v-for="t in [ 'usb', 'ble' ]">
        <span :class="{
            'nav-link': true,
            'active': transport === t
          }" @click="transport = t">Web {{t.toUpperCase()}}</span>
      </li>
      <li class="nav-item">
        <span class="nav-link"><s>Node HID</s></span>
      </li>
    </ul>

    <ul class="nav nav-pills flex-column mb-4">
      <li class="nav-item">
        <span class="nav-link small">EXPERIMENT 🧪</span>
      </li>
      <li class="nav-item">
        <span :class="{
            'nav-link': true,
            'active': atomicSwap === 'true'
          }" @click="atomicSwap === 'true' ? atomicSwap = '' : atomicSwap = 'true'">Atomic Swap</span>
      </li>
    </ul>
  </div>
</template>

<script>
import {
  getNetworkNames
} from '@/utils/networks'
import {
  wallets
} from '@/utils/wallets'
import { mapQs } from '@/mixins/map'
import filters from '@/mixins/filters'

export default {
  name: 'Home',
  mixins: [
    filters,
    mapQs([ 'chain', 'network', 'wallet', 'transport', 'erc20', 'atomicSwap' ])
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
    }
  }
}
</script>

<style lang="scss">
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
