<template>
  <div>
    <h2 class="text-center">{{currency.ticker}} on {{network | pretty}}</h2>
    <p class="text-center lead mb-5">Using {{wallet.name}} via {{transport | pretty}}</p>

    <div class="row mb-4">
      <div :class="{
          'col-md-8': true,
          'grayout no-events': !balance
        }">
        <div class="card mb-4">
          <div class="card-body">
            <h5 class="card-title">Send {{currency.ticker}}</h5>
            <div class="form-group">
              <label for="address">To Address <span class="text-primary">*</span></label>
              <input v-model="to" autocomplete="off" type="text" class="form-control" id="address">
            </div>
            <div class="form-group">
              <label for="amount">Amount in {{currency.ticker}} <span class="text-primary">*</span></label>
              <input v-model="amount" autocomplete="off" type="text" class="form-control" id="amount">
              <small class="form-text text-muted clickable" @click="amount = prettyBalance">Click here to select max amount (doesn't account network transaction fee)</small>
            </div>
            <button :class="{
              'btn': true,
              'btn-light no-events': busy,
              'btn-primary': !busy
            }" type="button" @click="sendTransaction" :disabled="!amount || !to">
              <span v-if="!busy">Send</span>
              <span v-else><Pacman />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
            </button>
          </div>
        </div>

        <Result v-if="result" :result="result" class="mb-4" />
        <ErrorComp v-if="error" :error="error" class="mb-4" />
      </div>
      <div class="col-md-4">
        <div class="card mb-2">
          <div class="card-body">
            <h5 class="card-title">Account</h5>
            <div class="mb-3">
              <p v-if="address" class="code-font mb-0">{{address.address}} <small v-if="address.derivationPath">({{address.derivationPath}})</small></p>
              <Pacman v-else />
            </div>
            <div>
              <p v-if="balance" class="mb-0">
                <span class="code-font">{{prettyBalance}} {{currency.ticker}}</span>
              </p>
              <Pacman v-else />
            </div>
          </div>
        </div>
        <div class="card mb-2" v-if="qrcode">
          <div class="card-body" v-html="qrcode" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import QRCode from 'qrcode'
import cryptoassets from '@liquality/cryptoassets'

import filters from '@/mixins/filters'
import { getClient } from '@/utils/client'
import { currencies } from '@/utils/currency'

import ErrorComp from '@/components/Error'
import Pacman from '@/components/Pacman'
import Result from '@/components/Result'

export default {
  mixins: [ filters ],
  components: {
    Pacman,
    Result,
    ErrorComp
  },
  props: {
    currency: Object,
    wallet: Object,
    transport: String,
    network: String,
    addressType: String
  },
  data: function () {
    return {
      address: null,
      balance: null,
      to: null,
      amount: null,
      busy: false,
      result: null,
      error: false,
      qrcode: null
    }
  },
  computed: {
    currencies: function () {
      return currencies
    },
    prettyBalance: function () {
      return cryptoassets[this.currency.ticker.toLowerCase()].unitToCurrency(this.balance)
    }
  },
  errorCaptured: function (e) {
    this.error = e
  },
  created: function () {
    const chain = this.currency.chain
    const erc20 = this.currency.tokenType === 'ERC-20'
    const erc20Address = erc20 ? '0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359' : false

    this.client = getClient(chain, this.network, this.wallet.name, this.transport, this.addressType, erc20Address)
    this.prepare()
  },
  methods: {
    prepare: async function () {
      try {
        this.address = await this.client.wallet.getUnusedAddress()

        const uri = [
          this.currency.name.toLowerCase(),
          this.address.address
        ].join(':')

        QRCode.toString(uri, {
          type: 'svg'
        }, (err, svg) => {
          if (err) throw err

          this.qrcode = svg
        })

        const usedAddresses = await this.client.wallet.getUsedAddresses()
        this.balance = await this.client.chain.getBalance(usedAddresses)
      } catch (e) {
        this.error = e
      }
    },
    sendTransaction: async function () {
      this.busy = true
      await this.$nextTick()

      const amount = cryptoassets[this.currency.ticker.toLowerCase()].currencyToUnit(this.amount)

      try {
        this.result = await this.client.chain.sendTransaction(this.to, amount, null, this.address.address)
      } catch (e) {
        this.error = e
      }

      this.to = null
      this.amount = null

      this.busy = false
    }
  }
}
</script>
