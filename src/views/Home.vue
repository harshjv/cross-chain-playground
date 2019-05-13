<template>
  <div>
    <div class="card mt-4 mb-3">
      <div class="card-body">
        <h2 class="h5 mb-3">Addresses</h2>
        <Code value="const usedAddresses = await client.wallet.getUsedAddresses()" @click="used" />
        <Code value="const unusedAddress = await client.wallet.getUnusedAddress()" @click="unused" />
        <Code value="const balance = await client.chain.getBalance(usedAddresses)" @click="balance" />
      </div>
    </div>

    <div class="card mt-4 mb-3">
      <div class="card-body">
        <h2 class="h5 mb-3">Message Signing</h2>
        <Code value="const sign = await client.wallet.signMessage('hello', unusedAddress)" @click="sign" />
      </div>
    </div>

    <div class="card mt-4 mb-3" v-if="atomicSwap === 'true'">
      <div class="card-body">
        <h2 class="h5 mb-3">Atomic Swap ⚡️</h2>
        <Code value="const secret = await client.swap.generateSecret('msg')" @click="secret" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

import { getClient } from '@/utils/client'
import { highlight } from '@/utils/code'

import Code from '@/components/Code'

export default {
  name: 'Home',
  components: {
    Code
  },
  computed: {
    ...mapState([ 'chain', 'network', 'transport', 'wallet', 'erc20', 'erc20Address', 'atomicSwap' ]),
    client: function () {
      return getClient(this.chain, this.network, this.transport, this.wallet, this.erc20, this.erc20Address, this.atomicSwap)
    }
  },
  methods: {
    highlight,
    unused: async function (id) {
      const result = await this.client.wallet.getUnusedAddress()
      this.$root.$emit('code:result', {
        id,
        result
      })
    },
    used: async function (id) {
      const result = await this.client.wallet.getUsedAddresses()
      this.$root.$emit('code:result', {
        id,
        result
      })
    },
    balance: async function (id) {
      const addresses = await this.client.wallet.getUsedAddresses()
      const result = await this.client.chain.getBalance(addresses)
      this.$root.$emit('code:result', {
        id,
        result
      })
    },
    sign: async function (id) {
      const address = await this.client.wallet.getUnusedAddress()
      const result = await this.client.wallet.signMessage('hello', address)
      this.$root.$emit('code:result', {
        id,
        result
      })
    },
    secret: async function (id) {
      const result = await this.client.swap.generateSecret('msg')
      this.$root.$emit('code:result', {
        id,
        result
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
.card-body {
  .mb-2:last-child {
    margin-bottom: 0!important;
  }
}
</style>
