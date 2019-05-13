<template>
  <div id="app">
    <nav class="navbar navbar-expand-lg navbar-light">
      <div class="container">
        <router-link class="navbar-brand" to="/">Cross Chain Playground</router-link>
      </div>
    </nav>
    <router-view/>
  </div>
</template>

<style lang="scss">
#app {
  border-top: 3px solid $primary;
}
</style>
