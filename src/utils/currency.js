export const wallets = [
  {
    name: 'Ledger Nano S',
    currencies: [ 'btc', 'eth' ],
    transports: [ 'usb' ]
  },
  {
    name: 'Ledger Nano X',
    currencies: [ 'btc', 'eth' ],
    transports: [ 'usb', 'ble' ]
  },
  {
    name: 'MetaMask',
    currencies: [ 'eth' ],
    transports: [ 'web-extension' ]
  }
]

export const currencies = [
  {
    id: 'btc',
    chain: 'btc',
    ticker: 'BTC',
    name: 'Bitcoin'
  },
  {
    id: 'eth',
    chain: 'eth',
    ticker: 'ETH',
    name: 'Ethereum'
  },
  {
    id: 'eth:erc20:dai',
    chain: 'eth',
    ticker: 'DAI',
    name: 'DAI',
    token: true,
    tokenType: 'ERC-20'
  }
]

export const findCurrency = id => currencies.find(c => c.id === id)

export const findWallets = chain => wallets.filter(w => w.currencies.includes(chain))
