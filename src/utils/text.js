const dict = {
  'ble': 'Web Bluetooth',
  'usb': 'Web USB',
  'web-extension': 'Web Extension'
}

export const pretty = str => dict[str] || `-${str}`.replace(/[-_]([a-z])/g, g => {
  const r = g[1].toUpperCase()

  if (g.includes('_')) {
    return ` ${r}`
  }

  return r
})
