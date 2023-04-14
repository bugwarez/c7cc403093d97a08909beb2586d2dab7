<template>
  <div>
    <h1>Select a Currency</h1>
    <select v-model="selectedCurrency" ref="currencySelect">
      <option v-for="currency in currencies" :key="currency" :value="currency">
        {{ currency }}
      </option>
    </select>
    <input type="number" v-model="amount" />
    <select v-model="targetCurrency" ref="currencySelect">
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
import { ref, watch } from 'vue'
import axios from 'axios'

export default {
  name: 'CurrencyConverter',
  setup() {
    const currencies = ref([])
    const selectedCurrency = ref(null)
    const targetCurrency = ref(null)
    const amount = ref(null)
    const convertedAmount = ref(null)

    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/symbols`, {
        headers: {
          apikey: import.meta.env.VITE_API_KEY
        }
      })
      .then((response) => {
        const data = response.data
        currencies.value = Object.keys(data.symbols)
        targetCurrency.value = data.base
      })
      .catch((error) => {
        console.log(error)
      })

    watch([selectedCurrency, amount, targetCurrency], ([selected, amt, target]) => {
      if (selected && amt && target) {
        axios
          // https://api.apilayer.com/exchangerates_data/convert?to=TRY&from=EUR&amount=100
          .get(
            `https://api.apilayer.com/exchangerates_data/convert?to=TRY&from=USD&amount=${amt}`,
            {
              headers: {
                apikey: import.meta.env.VITE_API_KEY
              }
            }
          )
          .then((response) => {
            const data = response.data
            const rate = data.rates[targetCurrency.value]
            convertedAmount.value = (rate * amount.value).toFixed(2)
            console.log('converted', convertedAmount.value)
          })
          .catch((error) => {
            console.log(error)
          })
      } else {
        convertedAmount.value = null
      }
    })

    return {
      currencies,
      selectedCurrency,
      targetCurrency,
      amount,
      convertedAmount
    }
  },
  watch: {
    selectedCurrency(newValue) {
      this.$nextTick(() => {
        this.$refs.currencySelect.focus()
      })
    },
    targetCurrency(newValue) {
      this.$nextTick(() => {
        this.$refs.currencySelect.focus()
      })
    }
  }
}
</script>
