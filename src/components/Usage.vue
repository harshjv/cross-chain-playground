<template>
  <div>
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
    <details open>
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
  mixins: [
    filters,
    mapQs([ 'erc20' ]),
    wrapLocal([ 'erc20' ])
  ],
  computed: {
    ...mapState([ 'chain', 'network', 'transport', 'addressType', 'wallet', 'erc20', 'atomicSwap' ]),
    libs: function () {
      return getLibs(this.chain, this.transport, this.wallet, this.erc20, this.atomicSwap)
    },
    code: function () {
      return getCode(this.libs, this.chain, this.network, this.transport, this.addressType, this.erc20)
    }
  },
  methods: {
    importStatements: function (type) {
      return makeLibsImportable(this.libs, type)
    },
    update: function () {
      if (this.chain === 'btc') {
      } else {
        if (this.erc20 === 'true') {
          this.erc20 = this.erc20Model
        }
      }
    }
  }
}
</script>
