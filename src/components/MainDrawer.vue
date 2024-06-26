<script setup lang="ts">
import MenuItem from '@/components/MenuItem.vue';

const menuItems = [
  {
    title: 'پیشخان',
    icon: 'mdi-view-dashboard-outline',
    to: { name: 'HomePage' }
  },
  { title: 'بازی‌ها', icon: 'mdi-gamepad-variant', to: { name: 'GamesIndex' }, exact: false },
  {
    title: 'بازی‌های گمشده',
    icon: 'mdi-gamepad-circle-down',
    to: { name: 'LostGamesIndex' },
    exact: false
  },
  { title: 'فایل‌های تلگرام', icon: 'mdi-airplane', to: { name: 'TGFilesIndex' }, exact: false }
];

const model = defineModel<boolean>();
</script>

<template>
  <v-navigation-drawer v-model="model" floating :elevation="1">
    <v-list :lines="false" nav style="padding:">
      <MenuItem v-for="(item, index) in menuItems" :key="index" :item="item" />
    </v-list>
  </v-navigation-drawer>
</template>

<style scoped>
:deep(.v-list-item__spacer) {
  width: 8px !important;
}
:deep(.v-list-subheader__text) {
  flex: 1;
}
/* .v-list--nav {
  padding-inline: 12px;
} */
</style>
