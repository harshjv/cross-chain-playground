import { pretty } from '@/utils/text'

export const mapComputed = (mutation, keys) => {
  const computed = {}

  keys.forEach(key => {
    computed[key] = {
      get () {
        return this.$store.state[key]
      },
      set (value) {
        this.$store.commit(mutation, {
          key,
          value
        })
      }
    }
  })

  return {
    computed
  }
}

export const mapQs = (keys) => mapComputed('NAVIGATE', keys)

export const wrapLocal = (keys) => {
  const data = {}
  const computed = {}

  keys.forEach(key => {
    const localKey = 'local' + pretty(key)

    data[localKey] = null

    computed[key + 'Model'] = {
      set: function (value) {
        this[localKey] = value
      },
      get: function () {
        return this[localKey] === null ? this[key] : this[localKey]
      }
    }
  })

  return {
    data: function () {
      return data
    },
    computed
  }
}
