<template>
  <div>
    <div class="row">
      <Toolbar class="col-md-2" />
      <div class="col-md-10">
        <div v-if="notSupported" class="card text-white bg-danger mb-4">
          <div class="card-body">
            <p class="mb-0"><a :href="notSupported.link" target="_blank" rel="noopener" style="color: inherit">{{notSupported.message}}</a></p>
          </div>
        </div>

        <Usage />

        <router-view class="mb-4"></router-view>

        <Error class="mb-4" :error="error" v-if="error" />

        <p class="mb-2"><small class="text-muted"><strong>ProTip&trade;</strong> <code class="ml-2">client</code> is available as <code>window.client</code></small></p>
        <p v-if="wallet === 'ledger'"><small class="text-muted">
          <strong>Minimum requirements</strong>
          <span v-if="transport === 'usb'" class="ml-2">A Ledger Nano S with Ledger Secure Element v1.5.5 &amp; MCU: 1.7 or above, or a Ledger Nano X.</span>
          <span v-if="transport === 'ble'" class="ml-2">A Ledger Nano X.</span>
        </small></p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

import Toolbar from '@/components/Toolbar'
import Usage from '@/components/Usage'
import Error from '@/components/Error'

export default {
  name: 'Default',
  components: {
    Toolbar,
    Usage,
    Error
  },
  created: function () {
    this.init()
  },
  data: function () {
    return {
      error: false
    }
  },
  errorCaptured: function (e) {
    this.error = e
    this.$root.$emit('code:error', {
      error: e
    })
  },
  methods: mapActions([ 'init' ]),
  computed: {
    ...mapState([ 'wallet', 'transport' ]),
    notSupported: function () {
      if (this.transport === 'ble' && !this.$win.navigator.bluetooth) {
        return {
          message: 'Your browser doesn\'t support Web BLE. Click here to know more about supported browsers.',
          link: 'https://caniuse.com/#feat=web-bluetooth'
        }
      }

      if (this.transport === 'usb' && !this.$win.navigator.usb) {
        return {
          message: 'Your browser doesn\'t support Web USB. Click here to know more about supported browsers.',
          link: 'https://caniuse.com/#feat=webusb'
        }
      }

      if (this.wallet === 'metamask' && !this.$win.web3) {
        return {
          message: 'Your browser doesn\'t have MetaMask extension. Click here to know more about MetaMask.',
          link: 'https://metamask.io/'
        }
      }

      return false
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
