const map = [
  {
    regex: /Network mismatch./,
    message (msg) {
      return `${msg.split('.')[1].trim()}.`
    }
  },
  {
    regex: /Unable to claim interface./,
    message: 'Your Ledger wallet is already in use by another application. Please close other applications and try again.'
  },
  {
    regex: /INS_NOT_SUPPORTED/,
    message: 'Application active on your Ledger device doesn\'t match your current configuration on this page.'
  },
  {
    regex: /0x6faa/,
    message: 'You might need to unlock your Ledger device and please try again.'
  },
  {
    regex: /navigator\.usb/,
    message: 'Your browser doesn\'t support Web USB.'
  },
  {
    regex: /bluetooth/,
    message: 'Your browser doesn\'t support Web BLE.'
  }
]

export default (e) => {
  const found = map.find(r => r.regex.test(e.message))

  if (found) {
    if (typeof found.message === 'string') {
      return found.message
    }

    return found.message(e.message)
  }

  return false
}
