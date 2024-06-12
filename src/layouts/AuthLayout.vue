<script setup lang="ts">
import { ref } from 'vue';
import MainDrawer from '@/components/MainDrawer.vue';

const drawer = ref(true);
</script>

<template>
  <v-app>
    <MainDrawer v-model="drawer" />

    <v-main>
      <v-container>
        <v-toolbar rounded :elevation="1" density="comfortable" class="mb-4">
          <template v-slot:prepend>
            <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
          </template>
          <v-toolbar-title>OPG Manager</v-toolbar-title>
          <template v-slot:append> </template>
        </v-toolbar>

        <RouterView />
      </v-container>
    </v-main>
  </v-app>
</template>
<style scoped>
.v-toolbar {
  background: rgb(var(--v-theme-surface));
  color: rgba(var(--v-theme-on-surface), var(--v-high-emphasis-opacity));
}
</style>
