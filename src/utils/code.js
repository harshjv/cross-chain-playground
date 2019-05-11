import { rpcUrls } from '@/utils/rpc'

export const CamelCase = str => `-${str}`.replace(/-([a-z])/g, g => g[1].toUpperCase())

export const chainMap = {
  btc: 'Bitcoin',
  eth: 'Ethereum'
}

export const getLibs = (chain, transport, wallet, erc20) => {
  const common = [ 'client' ]

  if (chain === 'btc') {
    return common.concat([
      'bitcoin-bitcore-rpc-provider',
      'bitcoin-ledger-provider',
      'bitcoin-networks'
    ])
  }

  if (chain === 'eth') {
    const eth = [
      'ethereum-rpc-provider',
      `ethereum-${wallet.toLowerCase()}-provider`,
      'ethereum-networks'
    ]

    if (erc20) {
      eth.push('ethereum-erc20-provider')
    }

    return common.concat(eth)
  }
}

export const makeLibsImportable = (libs, type) => {
  return libs.map(lib => {
    if (type === 'es6') {
      return `import ${CamelCase(lib)} from @liquality/${lib}`
    }
    if (type === 'es5') {
      return `const ${CamelCase(lib)} = require(@liquality/${lib})`
    }

    /* eslint-disable-next-line no-useless-escape */
    return `<script src="https://cdn.jsdelivr.net/npm/@liquality/${lib}@0.2.3/dist/${lib}.min.js"><\/script>\n<!-- available as window.${CamelCase(lib)} -->\n`
  }).join('\n')
}

export const getCode = (libs, chain, networkName, transport, erc20Address) => {
  const code = [
    `const client = new Client()`
  ]

  const other = libs
    .filter(l => !l.endsWith('networks'))
    .map(lib => {
      if (lib === 'client') return ''

      let args = ''

      if (lib.match(/rpc/)) {
        args = `'` + rpcUrls[chain][networkName].join(`', '`) + `'`
      }

      if (lib.match(/ledger/)) {
        args = `{ network: ${chainMap[chain]}Networks.${networkName} }`
      }

      if (lib.match(/metamask/)) {
        args = `window.web3.currentProvider, EthereumNetworks.${networkName}`
      }

      if (lib.match(/erc20/)) {
        args = `'${erc20Address}'` || `'contractAddress'`
      }

      const obj = `client.addProvider(new ${CamelCase(lib)}(${args}))`

      if (lib.match(/ledger/) && transport === 'ble') {
        return `${obj}.useWebBle()`
      }

      return obj
    })

  return code.concat(other).join('\n')
}
