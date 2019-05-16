<template>
  <div>
    <h2 class="text-center">{{currency.ticker}} on {{network | pretty}}</h2>
    <p class="text-center lead mb-5">Using {{wallet.name}} via {{transport | pretty}}</p>
    <div class="text-center row justify-content-center mb-5">
      <div class="col-md-3">
        <div :class="{
            'card mt-3 mb-3 clickable': true,
            'grayout': screen !== 'wallet'
          }" @click="screen = 'wallet'">
          <div class="card-body">
            <h2 class="h5 mb-0">Wallet</h2>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div :class="{
            'card mt-3 mb-3 clickable': true,
            'grayout': screen !== 'order-book'
          }" @click="screen = 'order-book'">
          <div class="card-body">
            <h2 class="h5 mb-0">Order Book</h2>
          </div>
        </div>
      </div>
    </div>
    <div class="row mb-4">
      <div :class="{
          'col-md-8': true,
          'grayout no-events': false
        }">
        <div class="card" v-if="screen === 'wallet'">
          <div class="card-body">
            <h5 class="card-title">Send {{currency.ticker}}</h5>
            <div class="form-group">
              <label for="address">To Address <span class="text-primary">*</span></label>
              <input v-model="to" autocomplete="off" type="text" class="form-control" id="address" placeholder="0x...">
            </div>
            <div class="form-group">
              <label for="amount">Amount <span class="text-primary">*</span></label>
              <input v-model="amount" autocomplete="off" type="text" class="form-control" id="amount" placeholder="5000">
              <small class="form-text text-muted clickable" @click="amount = balance">Click here to select max amount (doesn't account network transaction fee)</small>
            </div>
            <button :class="{
              'btn': true,
              'btn-light no-events': busy,
              'btn-primary': !busy
            }" type="button" @click="sendTransaction">
              <span v-if="!busy">Send</span>
              <span v-else><Pacman />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
            </button>
          </div>
        </div>
        <div v-else>
          <div class="card mb-2" v-for="offer in offers">
            <div class="card-body">
              <p class="lead">Swap with {{offer.alias}}</p>
              <p class="mb-0">Sell your {{offer.want.currency.toUpperCase()}} for {{offer.have.currency.toUpperCase()}} (Rate {{offer.rate}})</p>
            </div>
          </div>
        </div>

        <Result v-if="result" :result="result" class="mt-4" />
      </div>
      <div class="col-md-4">
        <div class="card mb-2" v-if="screen === 'order-book'">
          <div class="card-body">
            <h5 class="card-title">Network Status</h5>
            <div class="font-weight-normal">
              <p v-if="offers" class="mb-0">
                <span>{{agents}} Agent</span>
                <span v-if="offers"> / {{offers.length}} Offers</span>
              </p>
              <Pacman v-else />
            </div>
          </div>
        </div>
        <div class="card mb-2" v-if="screen === 'order-book'">
          <div class="card-body">
            <h5 class="card-title">Liquidity</h5>
            <div class="font-weight-normal">
              <p v-if="liquidityString" class="mb-0">
                {{liquidityString}}
              </p>
              <Pacman v-else />
            </div>
          </div>
        </div>
        <div class="card mb-2">
          <div class="card-body">
            <h5 class="card-title">Account</h5>
            <div class="mb-3">
              <p v-if="address" class="code-font mb-0">{{address.address}} <small v-if="address.derivationPath">({{address.derivationPath}})</small></p>
              <Pacman v-else />
            </div>
            <div>
              <p v-if="balance" class="mb-0">
                Balance: <span class="code-font">{{balance}}</span>
              </p>
              <Pacman v-else />
            </div>
          </div>
        </div>
        <div class="card" v-if="qrcode">
          <div class="card-body" v-html="qrcode" />
        </div>
      </div>
    </div>

    <ErrorComp class="mb-4" v-if="error" :error="error" />
  </div>
</template>

<script>
import QRCode from 'qrcode'

import filters from '@/mixins/filters'
import { getClient } from '@/utils/client'
import { getDefaultRpc } from '@/utils/rpc'
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
    network: String
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

      cp: {
        currency: 'BTC'
      },
      qrcode: null,
      agents: 0,
      offers: null,

      liquidity: null,
      liquidityString: null,

      screen: 'wallet'
    }
  },
  computed: {
    currencies: function () {
      return currencies
    }
  },
  errorCaptured: function (e) {
    this.error = e
  },
  created: function () {
    const chain = this.currency.chain
    const erc20 = this.currency.tokenType === 'ERC-20' ? 'true' : false
    const erc20Address = erc20 !== false ? '0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359' : false
    let wallet = this.wallet.name.toLowerCase()
    const rpc = {
      [chain]: getDefaultRpc(chain, this.network)
    }

    if (this.wallet.name.startsWith('ledger')) {
      wallet = 'ledger'
    }

    this.client = getClient(chain, this.network, this.transport, wallet, erc20, erc20Address, false, rpc)

    this.prepare()
  },
  methods: {
    prepare: async function () {
      try {
        const getUnusedPromise = this.client.wallet.getUnusedAddress()
        const _offers = await this.client.discovery.getOffers()
        const o = []
        const c = {}

        _offers.forEach(({ alias, address, offers }) => {
          this.agents = this.agents + 1
          offers.forEach(offer => {
            if (!c[offer.currency]) c[offer.currency] = {}

            o.push({
              alias,
              address,
              ...offer
            })
          })
        })

        console.log(o)

        // asd

        this.offers = o

        // this.liquidity = this.offers.reduce((acc, offer) => {
        //   if (!acc[offer.base]) acc[offer.base] = 0
        //   acc[offer.base] += offer.max
        //
        //   Object.keys(offer.offers).map(coin => {
        //     const o = offer.offers[coin]
        //
        //     if (!acc[coin]) acc[coin] = 0
        //     acc[coin] += o.max
        //   })
        //
        //   return acc
        // }, {})
        //
        // this.liquidityString = Object.keys(this.liquidity).map(key => {
        //   return `${this.liquidity[key]} ${key.toUpperCase()}`
        // }).join(' / ')

        this.address = await getUnusedPromise

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
      try {
        this.result = await this.client.chain.sendTransaction(this.to, this.amount, null, this.address.address)
      } catch (e) {
        this.error = e
      }
      this.busy = false
    }
  }
}
</script>
