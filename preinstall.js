if (process.env.NETLIFY) {
  // Because netlify can't build usb package :/
  // and we don't need it for the web build

  console.log('Removing usb module from package-lock.json')

  const fs = require('fs')
  const path = require('path')
  const lock = require('./package-lock.json')

  delete lock.dependencies.usb
  delete lock.dependencies['@ledgerhq/hw-transport-node-hid'].requires.usb

  const p = path.join(__dirname, 'package-lock.json')

  console.log('Writing new package-lock.json at ', p)

  fs.writeFileSync(p, JSON.stringify(lock, null, 2), 'utf8')
}
