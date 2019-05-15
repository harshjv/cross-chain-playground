<template>
  <div class="card text-white bg-danger">
    <div class="card-body">
      <div v-if="explanation" class="mb-3">{{explanation}}</div>
      <pre class="m-0"><code>{{error}}</code></pre>
    </div>
    <div class="card-footer">
      <small>Check console for more details</small>
    </div>
  </div>
</template>

<script>
import explain from '@/utils/explain'

export default {
  props: {
    error: {
      validator: function (value) {
        return true
      }
    }
  },
  created: function () {
    console.error(this.error)
  },
  computed: {
    explanation: function () {
      return explain(this.error)
    }
  }
}
</script>
