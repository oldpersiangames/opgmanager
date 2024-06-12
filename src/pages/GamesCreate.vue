<script setup lang="ts">
import GameForm from '@/components/GameForm.vue';
import { useGamesStore } from '@/stores/games';

const games = useGamesStore();
</script>

<template>
  <GameForm
    ref="formRef"
    @submit.prevent="
      async ($event, data) => {
        ($refs.formRef as any).loading = true;
        try {
          await games.create(data);
          $router.push({ name: 'GamesIndex' });
        } catch {}
        ($refs.formRef as any).loading = false;
      }
    "
  />
</template>
