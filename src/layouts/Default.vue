<template>
  <div class="container mt-4 mb-5">
    <div class="row">
      <Toolbar class="col-md-2" />
      <div class="col-md-10">
        <Usage />

        <router-view class="mb-4"></router-view>

        <div v-if="error" class="card text-white bg-danger">
          <div class="card-body">
            <div v-if="explainError" class="mb-3">{{explainError}}</div>
            <pre class="m-0"><code>{{error}}</code></pre>
          </div>
          <div class="card-footer">
            <small>Check console for more details</small>
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

import explain from '@/utils/explain'

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
      explainError: false,
      error: false
    }
  },
  errorCaptured: function (e) {
    this.explainError = explain(e)
    this.error = JSON.stringify(e, null, 2)
    this.$root.$emit('code:error', {
      error: e
    })
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
