export const transports = {
  ledger: [
    'usb',
    'ble'
  ],
  metamask: [
    'browser-extension'
  ]
}

export const getDefaultTransport = (wallet) => transports[wallet][0]

export const checkTransport = (wallet, transport) => transport && transports[wallet].find(t => transport === t)
