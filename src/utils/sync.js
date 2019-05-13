import router from '@/router'

import { checkNetwork, getDefaultNetworkName } from '@/utils/networks'
import { checkWallet, getDefaultWallet } from '@/utils/wallets'
import { checkTransport, getDefaultTransport } from '@/utils/transports'
import { checkRpc, getDefaultRpc } from '@/utils/rpc'

export const checkQs = (key, value, init) => {
  let changed = false
  let query = router.app.$route.query || {}

  query = {
    ...query
  }

  if (key) {
    changed = true
    query[key] = value
  }

  if (![ 'eth', 'btc' ].includes(query.chain)) {
    changed = true
    query = {
      chain: 'btc'
    }
  }

  if (!checkNetwork(query.chain, query.network)) {
    changed = true
    query = {
      ...query,
      network: getDefaultNetworkName(query.chain)
    }
  }

  if (!checkWallet(query.chain, query.wallet)) {
    changed = true
    query = {
      ...(query || query),
      wallet: getDefaultWallet(query.chain)
    }
  }

  if (!checkTransport(query.wallet, query.transport)) {
    changed = true
    query = {
      ...(query || query),
      transport: getDefaultTransport(query.wallet)
    }
  }

  if (!init) {
    if (!checkRpc(query.chain, query.network, query[query.chain + 'Rpc'])) {
      changed = true
      const rpc = getDefaultRpc(query.chain, query.network)

      const q = {
        [query.chain + 'Rpc']: rpc[0]
      }

      if (rpc[1]) {
        q[query.chain + 'RpcUser'] = rpc[1]
      }

      if (rpc[2]) {
        q[query.chain + 'RpcPass'] = rpc[2]
      }

      query = {
        ...(query || query),
        ...q
      }
    }
  }

  if (query.chain !== 'eth' && query.erc20) {
    changed = true
    query.erc20 = ''
  }

  return {
    query,
    changed
  }
}

export const syncAndNavigate = (key, value, init, before) => {
  const { query, changed } = checkQs(key, value, init)

  if (before) {
    before(query)
  }

  if (changed) {
    router.app.$router.replace({
      query
    })
  }
}
