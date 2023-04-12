<script setup>
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
import Button from "primevue/button"
import NavbarComponent from './components/NavbarComponent.vue';
</script>

<template>
  <div id="app">
    <NavbarComponent />
    <RouterView />
  </div>
</template>

<style scoped>

</style>
