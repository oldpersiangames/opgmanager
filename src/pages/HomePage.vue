<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';

const auth = useAuthStore();
</script>
<template>
  <v-card>
    <v-card-text>
      <div class="mb-2">
        <h5 class="text-h5">
          خوش اومدی {{ auth.user!.name }} <span class="text-high-emphasis">🥳</span>!
        </h5>
      </div>
    </v-card-text>
  </v-card>
</template>
