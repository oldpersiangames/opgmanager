import { ref } from 'vue'
import { defineStore } from 'pinia'
import { api } from '@/utils/axios'
import { useHelper } from '@/composables/helper'

export const useCompaniesStore = defineStore('companies', () => {
    const companies = ref([])
    const helper = useHelper()

    async function fetch() {
        const response = await api.get('/api/admin/companies')
        companies.value = response.data;
    }

    async function create(data: any) {
        const response = await api.post('/api/admin/companies', {
            ...data,
            tgfiles: data.tgfiles ? JSON.parse(data.tgfiles) : null,
            files: data.files ? JSON.parse(data.files) : null,
        });
        helper.notify('شرکت ثبت شد');
        return response.data;
    }

    async function fetchDetails(id: number) {
        const response = await api.get('/api/admin/companies/' + id.toString());
        return response.data;
    }

    async function update(id: number, data: any) {
        await api.put('/api/admin/companies/' + id.toString(), {
            ...data,
            tgfiles: data.tgfiles ? JSON.parse(data.tgfiles) : null,
            files: data.files ? JSON.parse(data.files) : null,
        });
        helper.notify('مشخصات شرکت آپدیت شد')
    }

    return { companies, fetch, create, fetchDetails, update }
})
