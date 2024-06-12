import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useSnackbarQueueStore = defineStore('snackbarQueue', () => {
    const queue = ref<Array<any>>([])

    return { queue }
})
