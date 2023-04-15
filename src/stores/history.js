// history.js
import { defineStore } from 'pinia'

export const useHistoryStore = defineStore('history', {
  state: () => ({
    conversions: []
  }),
  actions: {
    addConversion(conversion) {
      this.conversions.push(conversion)
    },
    clearConversions() {
      this.conversions = []
    }
  }
})
