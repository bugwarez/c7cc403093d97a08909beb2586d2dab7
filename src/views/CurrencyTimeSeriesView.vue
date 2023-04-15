<template>
  <div>
    <form @submit.prevent="handleSubmit">
      <label>
        Base currency:
        <select v-model="baseCurrency">
          <option v-for="currency in currencies" :value="currency">{{ currency }}</option>
        </select>
      </label>
      <label>
        Target currency:
        <select v-model="targetCurrencies" multiple>
          <option v-for="currency in currencies" :value="currency">{{ currency }}</option>
        </select>
      </label>
      <label>
        Date range:
        <input type="date" v-model="startDate" />
        <input type="date" v-model="endDate" />
      </label>
      <button type="submit">Submit</button>
    </form>
    <table v-if="rates">
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
    <canvas ref="chart"></canvas>
  </div>
</template>

<script>
import axios from 'axios'
import Chart from 'chart.js/auto'

export default {
  name: 'CurrencyRatesPage',
  data() {
    return {
      baseCurrency: 'EUR',
      targetCurrencies: ['USD'],
      startDate: '',
      endDate: '',
      currencies: [],
      rates: {}
    }
  },
  async created() {
    try {
      const response = await axios.get('https://api.apilayer.com/exchangerates_data/symbols', {
        headers: {
          apikey: import.meta.env.VITE_API_KEY
        }
      })
      this.currencies = Object.keys(response.data.symbols)
      console.log('this.currencies', this.currencies)
    } catch (error) {
      console.error(error)
    }
  },
  methods: {
    async handleSubmit() {
      const response = await axios.get('https://api.apilayer.com/exchangerates_data/timeseries', {
        params: {
          start_date: this.startDate,
          end_date: this.endDate,
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
