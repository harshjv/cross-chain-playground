<template>
  <div class="container mt-4 mb-5">
    <div class="row">
      <Toolbar class="col-md-2" />
      <div class="col-md-10">
        <Usage />

        <router-view class="repl"></router-view>

        <div v-if="error" class="card mb-3 text-white bg-danger">
          <div class="card-body">
            <pre class="m-0"><code>{{error}}<hr><small>Check console for more details</small></code></pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

import Toolbar from '@/components/Toolbar'
import Usage from '@/components/Usage'

export default {
  name: 'Default',
  components: {
    Toolbar,
    Usage
  },
  created: function () {
    this.init()
  },
  data: function () {
    return {
      error: false
    }
  },
  errorCaptured: function (err) {
    this.error = JSON.stringify(err, null, 2)
  },
  methods: mapActions([ 'init' ])
}
</script>

<style lang="scss">
button {
  code, pre {
    color: inherit;
  }
}
.text-white {
  code, pre {
    color: inherit;
  }
}
.btn {
  text-align: left!important;
}
.card-body {
  .mb-2:last-child {
    margin-bottom: 0!important;
  }
}
</style>
