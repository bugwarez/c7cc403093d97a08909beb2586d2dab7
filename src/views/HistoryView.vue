<template>
  <div>
    <h1>Conversion History</h1>
    <ul>
      <li v-for="(conversion, index) in conversions" :key="index">
        <p>
          {{ conversion.amount }} {{ conversion.selectedCurrency }} =
          {{ conversion.convertedAmount }} {{ conversion.targetCurrency }}
        </p>
        <p>Date: {{ conversion.selectedDate }}</p>
      </li>
    </ul>
    <button @click="clearHistory">Clear History</button>
  </div>
</template>

<script>
import { ref, watchEffect } from 'vue'
import { useHistoryStore } from '@/stores/history'

export default {
  name: 'HistoryView',
  setup() {
    const historyStore = useHistoryStore()
    const conversions = ref(historyStore.conversions)

    watchEffect(() => {
      conversions.value = historyStore.conversions
    })

    const clearHistory = () => {
      historyStore.clearConversions()
    }

    return {
      conversions,
      clearHistory
    }
  }
}
</script>
