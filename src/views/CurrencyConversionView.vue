<template>
  <div>
    <Calendar dateFormat="dd/mm/yy" :maxDate="maxDate" v-model="selectedDate" showIcon />
    <h1>Select a Currency</h1>

    <span class="p-input-icon-left">
      <i class="pi pi-money-bill" />
      <InputText v-model="amount" type="number" placeholder="Amount" />
    </span>
    <Dropdown v-model="selectedCurrency" :options="currencies" ref="currencySelect">
      <template #option="option">
        {{ option.option }}
      </template>
    </Dropdown>
    <!-- <select v-model="selectedCurrency" ref="currencySelect">
      <option v-for="currency in currencies" :key="currency" :value="currency">
        {{ currency }}
      </option>
    </select> -->
    <h1>Select Target Currency</h1>
    <span class="p-input-icon-left">
      <i class="pi pi-money-bill" />
      <InputText readonly v-model="convertedAmount" type="number" placeholder="Amount" />
    </span>
    <!-- <input readonly type="number" v-model="convertedAmount" /> -->
    <!-- <select v-model="targetCurrency">
      <option v-for="currency in currencies" :key="currency" :value="currency">
        {{ currency }}
      </option>
    </select> -->
    <Dropdown v-model="targetCurrency" :options="currencies">
      <template #option="option">
        {{ option.option }}
      </template>
    </Dropdown>

    <h2>Conversion Results</h2>
    <p v-if="convertedAmount">
      <span>date: {{ selectedDate }}</span>
      {{ amount }} {{ selectedCurrency }} = {{ convertedAmount }} {{ targetCurrency }}
    </p>
    <p v-else>Please enter an amount to convert.</p>
  </div>
</template>

<script>
//Components
import Calendar from 'primevue/calendar'
import InputText from 'primevue/inputtext'
import Dropdown from 'primevue/dropdown'
//!END OF components
import { ref, computed, watchEffect } from 'vue'
import axios from 'axios'
import { useHistoryStore } from '@/stores/history'

export default {
  name: 'CurrencyConversion',
  components: {
    Calendar,
    InputText,
    Dropdown
  },
  setup() {
    const historyStore = useHistoryStore()
    const currencies = ref([])
    const selectedCurrency = ref('TRY')
    const targetCurrency = ref('USD')
    const selectedDate = ref(
      `${new Date().getDate().toString().padStart(2, '0')}/${(new Date().getMonth() + 1)
        .toString()
        .padStart(2, '0')}/${new Date().getFullYear()}`
    )
    const maxDate = ref(new Date())
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
    //!At first we switched date format to dd/mm/yyyy but the api expected format in yyyy-mm-dd so we switched back
    const dateString = selectedDate.value
    const parts = dateString.split('/')
    const dateObject = new Date(parts[2], parts[1] - 1, parts[0])
    const formattedDate = dateObject.toISOString().slice(0, 10)
    watchEffect(() => {
      axios
        .get(
          `${import.meta.env.VITE_API_BASE_URL}/convert?to=${targetCurrency.value}&from=${
            selectedCurrency.value
          }&amount=${amount.value}&date=${formattedDate}`,
          {
            headers: {
              apikey: import.meta.env.VITE_API_KEY
            }
          }
        )
        .then((response) => {
          conversionRate.value = response.data.result
        })
    })

    const convertedAmount = computed(() => {
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
      convertedAmount,
      maxDate
    }
  }
}
</script>
