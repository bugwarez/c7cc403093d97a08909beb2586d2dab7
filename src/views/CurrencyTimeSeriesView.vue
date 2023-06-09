<template>
  <div style="padding: 25px">
    <form @submit.prevent="handleSubmit">
      <div style="margin-bottom: 5px">
        <label> Date range: </label>
        <Calendar style="margin-right: 5px" dateFormat="yy-mm-dd" v-model="startDate" showIcon />
        <Calendar
          :minDate="minStartDate"
          :maxDate="maxEndDate"
          dateFormat="yy-mm-dd"
          v-model="endDate"
          showIcon
        />
      </div>
      <div style="margin-bottom: 5px">
        <label>Base Currency</label>
        <Dropdown
          :loading="dropdownLoadingState"
          v-model="baseCurrency"
          :options="currencies"
          ref="currencySelect"
        >
          <template #option="option">
            {{ option.option }}
          </template>
        </Dropdown>
      </div>
      <div style="margin-bottom: 5px">
        <label> Target currency: </label>
        <MultiSelect
          :showToggleAll="false"
          v-if="currencies.length"
          v-model="targetCurrencies"
          :options="currencies"
          :placeholder="'Select currencies'"
        >
          <template #option="option">
            {{ option.option }}
          </template>
        </MultiSelect>
      </div>

      <Button type="submit">Submit</Button>
    </form>
    <div style="display: flex; flex-direction: table-row; margin-bottom: 5px; width: 100%">
      <div class="card" style="width: 100%; margin-top: 20px">
        <table class="my-table" v-if="rates">
          <thead>
            <tr>
              <th>Date</th>
              <th v-for="currency in targetCurrencies">{{ currency }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(rate, date) in rates" :key="date">
              <td>{{ date }}</td>
              <td v-for="currency in targetCurrencies">{{ rate[currency] }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="chart-container" style="height: 40vh; width: 80vw">
        <canvas ref="chart"></canvas>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import Chart from 'chart.js/auto'

//Components
import Calendar from 'primevue/calendar'
import InputText from 'primevue/inputtext'
import Dropdown from 'primevue/dropdown'
import Button from 'primevue/button'
import MultiSelect from 'primevue/multiselect'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
//!END OF components

export default {
  name: 'CurrencyRatesPage',
  components: {
    Calendar,
    InputText,
    Dropdown,
    Button,
    MultiSelect,
    DataTable,
    Column
  },
  data() {
    return {
      dropdownLoadingState: true,
      baseCurrency: 'EUR',
      targetCurrencies: [],
      startDate: '',
      endDate: '',
      currencies: [],
      rates: {}
    }
  },
  computed: {
    maxEndDate() {
      if (!this.startDate) return null
      const nextMonth = new Date(this.startDate)
      nextMonth.setMonth(nextMonth.getMonth() + 1)
      return nextMonth
    },
    minStartDate() {
      const nextDay = new Date(this.startDate)
      nextDay.setDate(nextDay.getDate() + 1)
      return nextDay
    }
  },
  mounted() {
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/symbols`, {
        headers: {
          apikey: import.meta.env.VITE_API_KEY
        }
      })
      .then((response) => {
        this.currencies = Object.keys(response.data.symbols).sort()
        this.dropdownLoadingState = false
      })
      .catch((error) => {
        console.error(error)
      })
  },
  methods: {
    async handleSubmit() {
      const startDateObject = new Date(this.startDate)
      const formattedStartDate = `${startDateObject.getFullYear()}-${(
        startDateObject.getMonth() + 1
      )
        .toString()
        .padStart(2, '0')}-${startDateObject.getDate().toString().padStart(2, '0')}`
      const endDateObject = new Date(this.endDate)
      const formattedEndDate = `${endDateObject.getFullYear()}-${(endDateObject.getMonth() + 1)
        .toString()
        .padStart(2, '0')}-${endDateObject.getDate().toString().padStart(2, '0')}`
      const response = await axios.get('https://api.apilayer.com/exchangerates_data/timeseries', {
        params: {
          start_date: formattedStartDate,
          end_date: formattedEndDate,
          base: this.baseCurrency,
          symbols: this.targetCurrencies.join(',')
        },
        headers: {
          apikey: import.meta.env.VITE_API_KEY
        }
      })
      this.rates = response.data.rates
      this.generateChart()
    },
    generateChart() {
      if (!Object.keys(this.rates).length) {
        return
      }
      const data = {
        labels: Object.keys(this.rates),
        datasets: this.targetCurrencies.map((currency) => ({
          label: currency,
          data: Object.values(this.rates).map((rate) => rate[currency])
        }))
      }
      const options = {
        scales: {
          x: {
            title: 'Date'
          },
          y: {
            title: 'Exchange Rate'
          }
        }
      }
      new Chart(this.$refs.chart, {
        type: 'line',
        data: data,
        options: options
      })
    }
  }
}
</script>
<style scoped>
.my-table {
  border-collapse: collapse;
  width: 100%;
  font-family: Arial, sans-serif;
  font-size: 14px;
  color: #333;
}

.my-table th,
.my-table td {
  padding: 8px;
  text-align: left;
  vertical-align: middle;
  border: 1px solid #ddd;
}

.my-table th {
  background-color: #f5f5f5;
  font-weight: bold;
  text-transform: uppercase;
}

.my-table tbody tr:nth-child(even) {
  background-color: #f2f2f2;
}

.my-table tbody td {
  font-weight: bold;
}
</style>
