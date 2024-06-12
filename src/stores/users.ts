import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { api } from '@/utils/axios'

export const useUsersStore = defineStore('users', () => {
    const users = ref([])

    async function fetch() {
        const response = await api.get('/api/admin/users')
        users.value = response.data;
    }

    return { users, fetch }
})
