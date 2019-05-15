<template>
  <div class="card text-white bg-success" v-if="!hide">
    <div class="card-body">
      <span class="close" @click="hide = true">&times;</span>
      <pre class="m-0"><code>{{result}}</code></pre>
    </div>
    <div class="card-footer">
      <small>Check console for detailed result</small>
    </div>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      hide: false
    }
  },
  props: {
    result: {
      validator: function (value) {
        return true
      }
    }
  }
}
</script>
