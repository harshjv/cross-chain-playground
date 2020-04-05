export const addressTypes = {
  btc: ['bech32', 'legacy'],
  eth: ['default']
}

export const getDefaultAddressType = chain => addressTypes[chain][0]

export const checkAddressType = (chain, addressType) => addressTypes[chain].includes(addressType)
