<script setup lang="ts">
import GameForm from '@/components/GameForm.vue';
import { useGamesStore } from '@/stores/games';
import { useRoute } from 'vue-router';

const games = useGamesStore();
const route = useRoute();
</script>

<template>
  <GameForm
    ref="formRef"
    @submit.prevent="
      async ($event, data) => {
        ($refs.formRef as any).loading = true;
        try {
          await games.update(parseInt(route.params.id.toString()), data);
          await ($refs.formRef as any).fetch();
        } catch {}
        ($refs.formRef as any).loading = false;
      }
    "
    :id="parseInt(route.params.id.toString())"
  />
</template>
