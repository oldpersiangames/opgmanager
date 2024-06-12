<script setup lang="ts">
import { ref } from 'vue';
import { api } from '@/utils/axios';
import { filesize } from 'filesize';

const tgfiles = ref<Array<any>>([]);

const search = ref('');
const loading = ref(false);

async function fetch() {
  loading.value = true;
  const response = await api.get('/api/admin/tgfiles');
  tgfiles.value = response.data;
  loading.value = false;
}
fetch();
</script>
<template>
  <v-card>
    <v-card-text class="d-flex align-center ga-4">
      <v-btn color="primary" prepend-icon="mdi-refresh" text="رفرش" @click="fetch" />
      <v-text-field
        v-model="search"
        label="جستجو"
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        hide-details
        single-line
        clearable
        density="compact"
      ></v-text-field>
    </v-card-text>

    <v-data-table
      dir="ltr"
      :loading="loading"
      :items="tgfiles"
      :headers="[
        {
          title: 'file_unique_id',
          key: 'file_unique_id'
        },
        {
          title: 'file_name',
          key: 'file_name'
        },
        {
          title: 'file_size',
          key: 'file_size'
        },
        {
          title: 'date',
          key: 'date'
        }
      ]"
      :search="search"
      :items-per-page="-1"
      hide-default-footer
    >
      <template v-slot:item.file_size="{ value }">
        {{ filesize(value) }}
      </template>
    </v-data-table>

    <v-card-text>
      <span class="text-subtitle2">حجم فایل‌ها: </span>
      <span dir="ltr">
        {{ filesize(tgfiles.reduce((sum, x) => sum + parseInt(x.file_size), 0)) }}
      </span>
    </v-card-text>
  </v-card>
</template>
