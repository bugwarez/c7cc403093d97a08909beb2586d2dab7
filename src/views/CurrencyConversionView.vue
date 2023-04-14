<template>
  <div>
    <h1>Select a Currency</h1>
    <select v-model="selectedCurrency" ref="currencySelect">
      <option v-for="currency in currencies" :key="currency" :value="currency">
        {{ currency }}
      </option>
    </select>
    <h1>Select Target Currency</h1>
    <select v-model="targetCurrency">
      <option v-for="currency in currencies" :key="currency" :value="currency">
        {{ currency }}
      </option>
    </select>
    <input type="number" v-model="amount" />
    <h2>Conversion Results</h2>
    <p v-if="convertedAmount">
      {{ amount }} {{ selectedCurrency }} = {{ convertedAmount }} {{ targetCurrency }}
    </p>
    <p v-else>Please enter an amount to convert.</p>
  </div>
</template>

<script>
import { ref, computed, watchEffect } from 'vue'
import axios from 'axios'

export default {
  name: 'CurrencyConverter',
  setup() {
    const currencies = ref([])
    const selectedCurrency = ref('TRY')
    const targetCurrency = ref('USD')
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
          }&amount=${amount.value}`,
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
      return (amount.value * conversionRate.value).toFixed(3)
    })

    return {
      currencies,
      selectedCurrency,
      targetCurrency,
      amount,
      convertedAmount
    }
  }
}
</script>
