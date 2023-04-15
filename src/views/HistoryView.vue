<template>
  <div>
    <h1>Conversion History</h1>
    <DataTable :value="conversions" :paginator="true" :rows="10" :rowsPerPageOptions="[10, 20, 30]">
      <Column field="selectedDate" header="Date"></Column>
      <Column field="amount" header="Amount"></Column>
      <Column field="selectedCurrency" header="Selected Currency"></Column>
      <Column field="convertedAmount" header="Converted Amount"></Column>
      <Column field="targetCurrency" header="Target Currency"></Column>
    </DataTable>
    <button @click="clearHistory">Clear History</button>
  </div>
</template>

<script>
import { ref, watchEffect } from 'vue'
import { useHistoryStore } from '@/stores/history'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import 'primevue/resources/themes/saga-blue/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'

export default {
  name: 'HistoryView',
  components: {
    DataTable,
    Column
  },
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
