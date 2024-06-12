import { ref } from 'vue'
import { defineStore } from 'pinia'
import { api } from '@/utils/axios'
import { useHelper } from '@/composables/helper'

export const useGamesStore = defineStore('games', () => {
    const games = ref<Array<any>>([])
    const helper = useHelper()

    async function fetch() {
        const response = await api.get('/api/admin/games')
        games.value = response.data;
    }

    async function create(data: any) {
        const response = await api.post('/api/admin/games', {
            ...data,
            tgfiles: data.tgfiles ? JSON.parse(data.tgfiles) : null,
            files: data.files ? JSON.parse(data.files) : null,
        });
        helper.notify('بازی ثبت شد');
        return response.data;
    }

    async function fetchDetails(id: number) {
        const response = await api.get('/api/admin/games/' + id.toString());
        return response.data;
    }

    async function update(id: number, data: any) {
        await api.put('/api/admin/games/' + id.toString(), {
            ...data,
            tgfiles: data.tgfiles ? JSON.parse(data.tgfiles) : null,
            files: data.files ? JSON.parse(data.files) : null,
        });
        helper.notify('مشخصات بازی آپدیت شد')
    }

    return { games, fetch, create, fetchDetails, update }
})
