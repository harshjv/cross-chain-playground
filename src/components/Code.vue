<template>
  <div class="mb-2">
    <button @click="click" class="btn-code"><code v-html="highlight(value)"></code></button>
    <span v-if="busy" class="ml-2">&middot;&middot;&middot;</span>
    <div v-if="result" class="alert alert-success mt-3 mb-0">
      <pre class="m-0"><code>{{result}}</code></pre>
    </div>
  </div>
</template>

<script>
import { highlight } from '@/utils/code'
import uuidv4 from 'uuid/v4'

export default {
  name: 'Code',
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
  },
  methods: {
    highlight,
    click: function () {
      this.busy = true
      this.$emit('click', this.id)
    }
  }
}
</script>
