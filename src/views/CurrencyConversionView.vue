<template>
  <div>
    <input type="date" v-model="selectedDate" />
    <h1>Select a Currency</h1>
    <input type="number" v-model="amount" />
    <select v-model="selectedCurrency" ref="currencySelect">
      <option v-for="currency in currencies" :key="currency" :value="currency">
        {{ currency }}
      </option>
    </select>
    <h1>Select Target Currency</h1>
    <input readonly type="number" v-model="convertedAmount" />
    <select v-model="targetCurrency">
      <option v-for="currency in currencies" :key="currency" :value="currency">
        {{ currency }}
      </option>
    </select>

    <h2>Conversion Results</h2>
    <p v-if="convertedAmount">
      <span>date: {{ selectedDate }}</span>
      {{ amount }} {{ selectedCurrency }} = {{ convertedAmount }} {{ targetCurrency }}
    </p>
    <p v-else>Please enter an amount to convert.</p>
  </div>
</template>

<script>
import { ref, computed, watchEffect } from 'vue'
import axios from 'axios'
import { useHistoryStore } from '@/stores/history'

export default {
  name: 'CurrencyConversion',
  setup() {
    const historyStore = useHistoryStore()
    const currencies = ref([])
    const selectedCurrency = ref('TRY')
    const targetCurrency = ref('USD')
    const selectedDate = ref(new Date().toISOString().slice(0, 10))
    const amount = ref(1)
    const conversionRate = ref(0)

    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/symbols`, {
        headers: {
          apikey: import.meta.env.VITE_API_KEY
        }
      })
      .then((response) => {
        currencies.value = Object.keys(response.data.symbols).sort()
      })

    watchEffect(() => {
      axios
        .get(
          `${import.meta.env.VITE_API_BASE_URL}/convert?to=${targetCurrency.value}&from=${
            selectedCurrency.value
          }&amount=${amount.value}&date=${selectedDate.value}`,
          {
            headers: {
              apikey: import.meta.env.VITE_API_KEY
            }
          }
        )
        .then((response) => {
          console.log('response.data', response.data)
          conversionRate.value = response.data.result
        })
    })

    const convertedAmount = computed(() => {
      // return conversionRate.value.toFixed(2)
      const result = conversionRate.value.toFixed(2)
      if (result) {
        historyStore.addConversion({
          amount: amount.value,
          selectedCurrency: selectedCurrency.value,
          targetCurrency: targetCurrency.value,
          selectedDate: selectedDate.value,
          convertedAmount: result
        })
      }
      return result
    })

    return {
      currencies,
      selectedCurrency,
      targetCurrency,
      selectedDate,
      amount,
      convertedAmount
    }
  }
}
</script>
