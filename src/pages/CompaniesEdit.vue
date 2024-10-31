<script setup lang="ts">
import CompanyForm from '@/components/CompanyForm.vue';
import { useCompaniesStore } from '@/stores/companies';
import { useRoute } from 'vue-router';

const companies = useCompaniesStore();
const route = useRoute();
</script>

<template>
  <CompanyForm
    ref="formRef"
    @submit.prevent="
      async ($event, data) => {
        ($refs.formRef as any).loading = true;
        try {
          await companies.update(parseInt(route.params.id.toString()), data);
          await ($refs.formRef as any).fetch();
        } catch {}
        ($refs.formRef as any).loading = false;
      }
    "
    :id="parseInt(route.params.id.toString())"
  />
</template>
