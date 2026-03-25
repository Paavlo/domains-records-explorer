<script setup lang="ts">
import DomainsExplorerGrid from '@/views/domains-explorer/DomainsExplorerGrid.vue'
</script>

<template>
  <div class="app__container">
    <main class="main">
      <DomainsExplorerGrid />
    </main>
  </div>
</template>

<style lang="scss">
@use '@/assets/styles/app.scss';

.app__container {
  min-height: 100vh;
}

.header {
  min-width: 100%;
  line-height: 1.5;

  &__nav {
    width: 100%;
    font-size: 15px;
    text-align: center;
    margin-top: 2rem;
  }

  &__nav a.router-link-exact-active {
    color: var(--color-text);
  }

  &__nav a.router-link-exact-active:hover {
    background-color: transparent;
  }

  &__nav a {
    display: inline-block;
    padding: 0 1rem;
    border-left: 1px solid var(--color-border);
  }

  &__nav a:first-of-type {
    border: 0;
  }
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);

    &__nav {
      text-align: left;
      margin-left: -1rem;
      font-size: 1rem;

      padding: 1rem 0;
      margin-top: 1rem;
    }
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
