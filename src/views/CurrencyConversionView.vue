<template>
    <div class="card flex justify-content-center">
        <Calendar dateFormat="dd/mm/yy"  v-model="date" showIcon  />
    </div>
</template>


<script setup>
import { ref } from "vue";

const date = ref();
</script>
<script>
import Calendar from 'primevue/calendar';
import { ref } from "vue";

const date = ref();

export default {
    name: 'NavbarComponent',
    components: {
      Calendar,

    },
}
</script>
<style lang="">
    
</style>