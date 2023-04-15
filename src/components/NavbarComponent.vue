<template>
  <div class="card relative z-2">
    <Menubar :model="menuItems" />
  </div>
</template>

<script>
import Menubar from 'primevue/menubar'

export default {
  name: 'NavbarComponent',
  components: {
    Menubar
  },
  data() {
    return {
      menuItems: [
        {
          label: 'Home',
          icon: 'pi pi-fw pi-home',
          to: '/'
        },
        {
          label: 'Currency Conversion',
          icon: 'pi pi-money-bill',
          to: '/currency-conversion'
        },
        {
          label: 'Currency Time Series',
          icon: 'pi pi-calendar',
          to: '/currency-time-series'
        },
        {
          label: 'History',
          icon: 'pi pi-history',
          to: '/history'
        }
      ]
    }
  }
}
</script>
