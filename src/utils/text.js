export const pretty = str => `-${str}`.replace(/[-_]([a-z])/g, g => {
  const r = g[1].toUpperCase()

  if (g.includes('_')) {
    return ` ${r}`
  }

  return r
})
