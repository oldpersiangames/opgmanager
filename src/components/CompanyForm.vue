<script setup lang="ts">
import { ref } from 'vue';
import BaseRichEditor from './BaseRichEditor.vue';

import { useCompaniesStore } from '@/stores/companies';
import { Codemirror } from 'vue-codemirror';
import { json } from '@codemirror/lang-json';
import { useUsersStore } from '@/stores/users';
import { useHelper } from '@/composables/helper';
import type { Game } from '@/types';

const companies = useCompaniesStore();
const users = useUsersStore();

const form = ref<Game>({ games: [{}], contributes: [], photos: [], links: [] } as Game);
const loading = ref(false);

const helper = useHelper();

const selectedLinkIndex = ref(null);
const linkForm = ref({
  title_fa: '',
  title_en: '',
  url: ''
});
const linkDialog = ref(false);

const props = defineProps({
  id: {
    type: Number,
    required: false
  },
  readonly: {
    type: Boolean,
    default: false
  }
});

async function fetch() {
  loading.value = true;
  const company = await companies.fetchDetails(props.id!);
  form.value = company;
  loading.value = false;
}

companies.fetch();
users.fetch();
if (props.id) {
  fetch();
}

defineOptions({
  inheritAttrs: false
});
defineExpose({ loading, fetch });
</script>

<template>
  <v-form
    @submit.prevent="
      async ($event) => {
        if (!(await $event).valid) {
          return;
        }

        $emit('submit', $event, form);
      }
    "
  >
    <v-card>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="form.slug"
              :rules="[(val) => !!val || 'Field is required']"
              label="اسلاگ"
              hide-details
              required
              density="comfortable"
              variant="outlined"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="4">
            <v-combobox
              label="عنوان صفحه (فارسی)"
              multiple
              chips
              v-model="form.title_fa"
              required
              density="comfortable"
              variant="outlined"
            />
          </v-col>

          <v-col cols="12" md="4">
            <v-combobox
              label="عنوان صفحه (انگلیسی)"
              multiple
              chips
              v-model="form.title_en"
              dir="ltr"
              required
              density="comfortable"
              variant="outlined"
            />
          </v-col>

          <v-col cols="12" md="6">
            <BaseRichEditor v-model="form.content_fa" placeholder="متن (فارسی)" />
          </v-col>

          <v-col cols="12" md="6">
            <BaseRichEditor v-model="form.content_en" placeholder="متن (انگلیسی)" />
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-text class="d-flex justify-end">
        <v-btn color="primary" text="ذخیره" type="submit" :loading="loading" />
      </v-card-text>
    </v-card>
  </v-form>
</template>
