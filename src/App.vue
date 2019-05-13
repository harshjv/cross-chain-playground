<template>
  <div id="app">
    <nav class="navbar navbar-expand-lg navbar-light">
      <div class="container">
        <router-link class="navbar-brand" to="/">Cross Chain Playground</router-link>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
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
