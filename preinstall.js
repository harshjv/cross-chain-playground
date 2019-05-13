if (process.env.NETLIFY) {
  // Because netlify can't build usb package :/
  // and we don't need it for the web build

  const lock = require('./package-lock.json')

  delete lock.dependencies.usb
  delete lock.dependencies['@ledgerhq/hw-transport-node-hid'].requires.usb

  require('fs').writeFileSync('./package-lock.json', JSON.stringify(lock, null, 2), 'utf8')
}
