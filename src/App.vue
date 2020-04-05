<template>
  <div id="app">
    <nav class="navbar navbar-expand-lg navbar-light">
      <div class="container">
        <router-link class="navbar-brand" to="/">Cross-Chain Playground</router-link>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav">
            <li class="nav-item">
              <router-link :class="{ 'nav-link': true, active: $route.path === '/' }" to="/">Library</router-link>
            </li>
            <li class="nav-item">
              <router-link :class="{ 'nav-link': true, active: $route.path.startsWith('/wallet') }" to="/wallet">Wallet</router-link>
            </li>
          </ul>
          <ul class="navbar-nav ml-auto">
            <li class="nav-item">
              <a class="nav-link" href="https://github.com/liquality/chainabstractionlayer" rel="noopener" target="_blank">Chain Abstraction Layer</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="https://liquality.io/" rel="noopener" target="_blank">Liquality</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    <router-view class="container mt-4 mb-5" />
  </div>
</template>

<style lang="scss">
#app {
  border-top: 3px solid $primary;
}
</style>
