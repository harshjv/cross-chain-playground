import axios from 'axios'

import BitcoinRpcProvider from '@liquality/bitcoin-bitcore-rpc-provider'
const rpc = new BitcoinRpcProvider('http://localhost:4321/bitcoind/', 'bitcoin', 'local321')

export const getOffers = async (agents) => {
  if (!agents) {
    agents = await getAgents()
  }

  return Promise.all(
    agents
      .map(agent => axios.get(`${agent.address}/offers.json`)
        .then(({ data }) => data))
  )
}

export const getAgents = async () => {
  const [ peers, networkInfo ] = await Promise.all([
    rpc.jsonrpc('getpeerinfo'),
    rpc.jsonrpc('getnetworkinfo')
  ])

  if (networkInfo.subversion) {
    peers.push({
      subver: networkInfo.subversion
    })
  }

  return peers.map(peer => {
    if (!peer.subver) return false

    const found = peer.subver.match(/\((.*)\)/)
    if (found && found[1]) {
      const address = Buffer.from(found[1], 'base64').toString()

      if (address.match(/^https?/)) {
        return { address, peer }
      }

      return false
    }
  }).filter(peer => !!peer)
}
