<script setup lang="ts">
import { useCompaniesStore } from '@/stores/companies';
import { ref } from 'vue';

const companies = useCompaniesStore();
const loading = ref(false);
const search = ref('');
async function fetch() {
  loading.value = true;
  await companies.fetch();
  loading.value = false;
}
fetch();
</script>

<template>
  <v-card>
    <v-card-text class="d-flex align-center ga-4">
      <v-btn
        :to="{ name: 'CompaniesCreate' }"
        color="primary"
        prepend-icon="mdi-plus"
        text="شرکت جدید"
      />
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
      :headers="[
        {
          title: 'نام فارسی',
          key: 'title_fa'
        },
        {
          title: 'نام انگلیسی',
          key: 'title_en'
        },
        {
          title: 'اسلاگ',
          key: 'slug'
        },
        {
          title: 'عملیات',
          key: 'actions',
          align: 'end'
        }
      ]"
      :loading="loading"
      :items="companies.companies"
      :search="search"
    >
      <template v-slot:item.actions="{ item }">
        <v-btn
          :to="{ name: 'CompaniesEdit', params: { id: item.id } }"
          icon="mdi-file-edit"
          variant="text"
          density="comfortable"
        />
      </template>
    </v-data-table>
  </v-card>
</template>
