<template>
  <div>
    <div class="card mt-4 mb-3">
      <div class="card-body">
        <h2 class="h5 mb-3">Addresses</h2>
        <Code value="const usedAddresses = await client.wallet.getUsedAddresses()" @click="exec('used', $event)" />
        <Code value="const unusedAddress = await client.wallet.getUnusedAddress()" @click="exec('unused', $event)" />
        <Code value="const balance = await client.chain.getBalance(usedAddresses)" @click="exec('balance', $event)" />
      </div>
    </div>

    <div class="card mt-4 mb-3">
      <div class="card-body">
        <h2 class="h5 mb-3">Message Signing</h2>
        <Code value="const sign = await client.wallet.signMessage('hello', unusedAddress)" @click="exec('sign', $event)" />
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
  components: {
    Code
  },
  computed: {
    ...mapState([ 'chain', 'network', 'transport', 'wallet', 'addressType', 'erc20' ]),
    client: function () {
      const client = getClient(
        this.chain,
        this.network,
        this.wallet,
        this.transport,
        this.addressType,
        this.erc20
      )

      this.$win.client = client

      return client
    }
  },
  methods: {
    highlight,
    exec: async function (method, id) {
      const result = await this[method]()

      console.log(result)

      this.$root.$emit('code:result', {
        id,
        result
      })
    },
    unused: function () {
      return this.client.wallet.getUnusedAddress()
    },
    used: function () {
      return this.client.wallet.getUsedAddresses()
    },
    balance: async function () {
      const addresses = await this.client.wallet.getUsedAddresses()
      return this.client.chain.getBalance(addresses)
    },
    sign: async function () {
      const address = await this.client.wallet.getUnusedAddress()
      return this.client.wallet.signMessage('hello', address)
    },
    secret: function () {
      return this.client.swap.generateSecret('msg')
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
.text-muted, .text-white {
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
