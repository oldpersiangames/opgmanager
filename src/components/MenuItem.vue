<script setup lang="ts">
defineProps(['item']);
</script>
<template>
  <template v-if="item.children?.length">
    <v-list-group active-color="#FF0000" :title="item.title" :prepend-icon="item.icon">
      <template v-slot:activator="{ isOpen, props }">
        <v-list-item
          color="primary"
          v-bind="props"
          rounded="lg"
          :variant="isOpen ? 'tonal' : 'text'"
        />
      </template>
      <MenuItem v-for="(m, index) in item.children" :key="index" :item="m" />
    </v-list-group>
  </template>
  <template v-else-if="item.to">
    <v-list-item
      color="primary"
      rounded="lg"
      :prepend-icon="item.icon"
      :title="item.title"
      :class="{ 'has-bullet': !item.icon }"
      :to="$router.hasRoute(item.to.name) ? item.to : undefined"
      :exact="item.exact ?? true"
    >
      <template v-if="!item.icon" #prepend>
        <v-icon icon="mdi-circle-outline" size="24" style="font-size: 12px"></v-icon>
      </template>
    </v-list-item>
  </template>

  <template v-else
    ><v-list-subheader class="">
      <div class="d-flex align-center ga-2">
        <div><v-icon icon="mdi-circle" color="red" style="font-size: 5px" /> {{ item.title }}</div>
        <div class="flex-fill">
          <v-divider :thickness="2"></v-divider>
        </div>
      </div> </v-list-subheader
  ></template>
</template>
<style scoped>
/* .v-list-group__items .v-list-item.has-bullet {
  padding-inline-start: calc(var(--indent-padding) - var(--prepend-width)) !important;
} */

/* .v-list-group {
  --list-indent-size: 10px !important;
  --prepend-width: 0px !important;
} */
</style>
