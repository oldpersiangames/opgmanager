import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { api } from '@/utils/axios'

export const useCompaniesStore = defineStore('companies', () => {
    const companies = ref([])

    async function fetch() {
        const response = await api.get('/api/admin/companies')
        companies.value = response.data;
    }

    return { companies, fetch }
})
