<script setup lang="ts">
import CompanyForm from '@/components/CompanyForm.vue';
import { useCompaniesStore } from '@/stores/companies';

const companies = useCompaniesStore();
</script>

<template>
  <CompanyForm
    ref="formRef"
    @submit.prevent="
      async ($event, data) => {
        ($refs.formRef as any).loading = true;
        try {
          await companies.create(data);
          $router.push({ name: 'CompaniesIndex' });
        } catch {}
        ($refs.formRef as any).loading = false;
      }
    "
  />
</template>
