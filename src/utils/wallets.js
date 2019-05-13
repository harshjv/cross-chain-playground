export const wallets = {
  btc: [
    'ledger'
  ],
  eth: [
    'ledger',
    'metamask'
  ]
}

export const getDefaultWallet = (chain) => wallets[chain][0]

export const checkWallet = (chain, wallet) => wallet && wallets[chain].find(w => wallet === w)
