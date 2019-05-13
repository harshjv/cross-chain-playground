import hljs from 'highlight.js/lib/highlight'
import javascript from 'highlight.js/lib/languages/javascript'
import xml from 'highlight.js/lib/languages/xml'
import 'highlight.js/styles/github.css'

import { rpcUrls } from '@/utils/rpc'

hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('xml', xml)

export const CamelCase = str => `-${str}`.replace(/-([a-z])/g, g => g[1].toUpperCase())

export const chainMap = {
  btc: 'Bitcoin',
  eth: 'Ethereum',
  ethereum: 'eth',
  bitcoin: 'btc',
  Ethereum: 'eth',
  Bitcoin: 'btc'
}

export const getLibs = (chain, transport, wallet, erc20, atomicSwap) => {
  let libs = [ 'client' ]
  let swapProvider = false

  if (chain === 'btc') {
    libs = libs.concat([
      'bitcoin-bitcore-rpc-provider',
      'bitcoin-ledger-provider',
      'bitcoin-networks'
    ])
  }

  if (chain === 'eth') {
    libs = libs.concat([
      'ethereum-rpc-provider',
      `ethereum-${wallet.toLowerCase()}-provider`,
      'ethereum-networks'
    ])

    if (erc20 === 'true') {
      libs.push('ethereum-erc20-provider')
    }
  }

  if (atomicSwap === 'true') {
    if (chain === 'btc') {
      swapProvider = 'bitcoin-swap-provider'
    } else {
      if (erc20 === 'true') {
        swapProvider = 'ethereum-erc20-swap-provider'
      } else {
        swapProvider = 'ethereum-swap-provider'
      }
    }
  }

  if (swapProvider) {
    libs = libs.concat([ swapProvider ])
  }

  return libs
}

export const makeLibsImportable = (libs, type) => {
  const code = libs.map(lib => {
    const extraNewLine = lib === 'client'

    if (type === 'es6') {
      return `import ${CamelCase(lib)} from @liquality/${lib}${extraNewLine ? '\n' : ''}`
    }
    if (type === 'es5') {
      return `const ${CamelCase(lib)} = require(@liquality/${lib})${extraNewLine ? '\n' : ''}`
    }

    return [
      `<script src="https://cdn.jsdelivr.net/npm/@liquality/${lib}@0.2.3/dist/${lib}.min.js"></script>`,
      `<!-- available as window.${CamelCase(lib)} -->\n`
    ].join('\n')
  }).join('\n')

  if (type === 'web') {
    return hljs.highlight('xml', code).value
  }

  return hljs.highlight('javascript', code).value
}

export const highlight = (code) => {
  return hljs.highlight('javascript', code).value
}

export const getCode = (libs, chain, network, transport, erc20Address, rpc) => {
  const code = [
    `const client = new Client()`
  ]

  const other = libs
    .filter(l => !l.endsWith('networks'))
    .map(lib => {
      if (lib === 'client') return ''

      let args = ''

      if (lib.match(/rpc/)) {
        args = `'` + rpc[chain].join(`', '`) + `'`
      }

      if (lib.match(/ledger/)) {
        args = `{ network: ${chainMap[chain]}Networks.${network} }`
      }

      if (lib.match(/metamask/)) {
        args = `window.web3.currentProvider, EthereumNetworks.${network}`
      }

      if (lib.match(/erc20-provider/)) {
        args = `'${erc20Address}'` || `'contractAddress'`
      }

      const obj = `client.addProvider(new ${CamelCase(lib)}(${args}))`

      if (lib.match(/ledger/) && transport === 'ble') {
        return `${obj}.useWebBle()`
      }

      return obj
    })

  return hljs.highlight('javascript', code.concat(other).join('\n')).value
}
