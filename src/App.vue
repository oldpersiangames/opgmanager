<script setup lang="ts">
import { useSnackbarQueueStore } from './stores/snackbarQueue'

const snackbarQueue = useSnackbarQueueStore()
</script>

<template>
  <RouterView />
  <v-snackbar-queue v-model="snackbarQueue.queue"></v-snackbar-queue>
</template>
