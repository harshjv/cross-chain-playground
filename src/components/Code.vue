<template>
  <div class="code-line mb-2">
    <button @click="click" class="btn-code"><code v-html="highlight(value)"></code></button>
    <span v-if="!busy" class="badge badge-pill badge-light ml-2">click to run</span>
    <Pacman class="ml-2" v-if="busy" />
    <Result v-if="result" class="mt-3 mb-3" :result="result" />
  </div>
</template>

<script>
import { highlight } from '@/utils/code'
import uuidv4 from 'uuid/v4'

import Result from '@/components/Result'
import Pacman from '@/components/Pacman'

export default {
  components: {
    Result,
    Pacman
  },
  props: {
    value: String
  },
  data: function () {
    return {
      busy: false,
      result: null
    }
  },
  created: function () {
    this.id = uuidv4()

    this.$root.$on('code:result', ({ id, result }) => {
      if (id === this.id) {
        this.result = JSON.stringify(result, null, 2)
        this.busy = false
      }
    })

    this.$root.$on('code:error', () => {
      if (this.busy) {
        this.busy = false
      }
    })
  },
  methods: {
    highlight,
    click: function () {
      if (!this.busy) {
        this.busy = true
        this.$emit('click', this.id)
      }
    }
  }
}
</script>

<style lang="scss">
.close {
  margin-top: -15px;
  margin-right: -10px;
}
.code-line {
  .badge {
    display: none;
  }
}

.btn-code {
  &:hover {
    & + .badge {
      display: inline;
    }
  }
}
</style>
