<script setup lang="ts">
import { ref } from 'vue';
import BaseRichEditor from './BaseRichEditor.vue';
import { useGamesStore } from '@/stores/games';
import { useCompaniesStore } from '@/stores/companies';
import { Codemirror } from 'vue-codemirror';
import { json } from '@codemirror/lang-json';
import { useUsersStore } from '@/stores/users';
import { useHelper } from '@/composables/helper';
import type { Game } from '@/types';

const games = useGamesStore();
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
  const game = await games.fetchDetails(props.id!);
  game.tgfiles = game.tgfiles ? JSON.stringify(game.tgfiles) : '';
  game.files = game.files ? JSON.stringify(game.files) : '';
  form.value = game;
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
          <v-col cols="12">
            <v-card>
              <v-card-item>
                <v-card-title>
                  <span class="text-h6">مشخصات بازی‌ها</span>
                </v-card-title>

                <template v-slot:append>
                  <v-btn
                    color="primary"
                    text="افزودن بازی"
                    @click="
                      form.games.push({
                        title_en: '',
                        title_fa: '',
                        dubbed: false,
                        modified: false,
                        subtitle: false,
                        iranian: false,
                        collection: false
                      })
                    "
                  />
                </template>
              </v-card-item>

              <v-divider />
              <v-card-text class="d-flex flex-column ga-3">
                <div
                  v-for="(game, index) in form.games"
                  :key="index"
                  class="d-flex justify-space-between align-center"
                >
                  <v-row>
                    <v-col cols="12" md="4">
                      <v-combobox
                        v-model="game.title_en"
                        :rules="[(val) => !!val || 'Field is required']"
                        label="عنوان (انگلیسی)"
                        hide-details
                        required
                        density="comfortable"
                        variant="outlined"
                        multiple
                        chips
                      />
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-combobox
                        v-model="game.title_fa"
                        :rules="[(val) => !!val || 'Field is required']"
                        label="عنوان (فارسی)"
                        hide-details
                        required
                        density="comfortable"
                        variant="outlined"
                        multiple
                        chips
                      />
                    </v-col>
                    <v-col cols="12" md="4">
                      <div class="d-flex">
                        <v-checkbox hide-details size="xs" v-model="game.dubbed" label="دوبله" />
                        <v-checkbox
                          hide-details
                          size="xs"
                          v-model="game.modified"
                          label="ماد شده"
                        />
                        <v-checkbox
                          hide-details
                          size="xs"
                          v-model="game.subtitle"
                          label="زیرنویس"
                        />
                        <v-checkbox hide-details size="xs" v-model="game.iranian" label="ایرانی" />
                        <v-checkbox
                          hide-details
                          size="xs"
                          v-model="game.collection"
                          label="مجموعه"
                        />
                      </div>
                    </v-col>
                  </v-row>
                  <div>
                    <v-menu>
                      <template v-slot:activator="{ props }">
                        <v-btn
                          v-bind="props"
                          variant="text"
                          density="comfortable"
                          icon="mdi-dots-vertical"
                        ></v-btn>
                      </template>
                      <v-list>
                        <v-list-item @click="form.games.splice(index, 1)">
                          <v-list-item-title>حذف</v-list-item-title>
                        </v-list-item>
                      </v-list>
                    </v-menu>
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>

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
            <v-text-field
              v-model="form.ia_id"
              label="ia_id"
              hide-details
              required
              density="comfortable"
              variant="outlined"
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="4">
            <v-switch hide-details v-model="form.selling" label="در حال فروش" color="primary" />
          </v-col>

          <v-col cols="12" md="4">
            <v-text-field
              label="عنوان صفحه (فارسی)"
              hint="بهتر است این فیلدها را خالی بگذارید تا از عنوان بازی استفاده شود"
              v-model="form.title_fa"
              required
              density="comfortable"
              variant="outlined"
            />
          </v-col>

          <v-col cols="12" md="4">
            <v-text-field
              label="عنوان صفحه (انگلیسی)"
              hint="بهتر است این فیلدها را خالی بگذارید تا از عنوان بازی استفاده شود"
              v-model="form.title_en"
              dir="ltr"
              required
              density="comfortable"
              variant="outlined"
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-autocomplete
              label="تهیه‌کننده"
              v-model="form.producers"
              variant="outlined"
              density="comfortable"
              :items="companies.companies"
              item-title="title_fa"
              item-value="id"
              multiple
              chips
              hide-details
            ></v-autocomplete>
          </v-col>

          <v-col cols="12" md="4">
            <v-autocomplete
              label="ناشر"
              v-model="form.publishers"
              variant="outlined"
              density="comfortable"
              :items="companies.companies"
              item-title="title_fa"
              item-value="id"
              multiple
              chips
              hide-details
            ></v-autocomplete>
          </v-col>

          <v-col cols="12" md="4">
            <v-combobox
              label="تاریخ انتشار"
              v-model="form.release_dates"
              dir="ltr"
              multiple
              chip
              variant="outlined"
              density="comfortable"
              hide-details
            />
          </v-col>

          <v-col cols="12" md="4">
            <v-autocomplete
              label="سکو"
              v-model="form.platforms"
              :rules="[(val) => !!val || 'Field is required']"
              variant="outlined"
              density="comfortable"
              :items="['Windows', 'PS1', 'PS2', 'Xbox 360']"
              multiple
              chips
              hide-details
            ></v-autocomplete>
          </v-col>

          <v-col cols="12" md="4">
            <v-combobox
              label="منتشر شده روی (انگلیسی)"
              v-model="form.released_on_en"
              dir="ltr"
              multiple
              chips
              variant="outlined"
              density="comfortable"
              hide-details
            />
          </v-col>

          <v-col cols="12" md="4">
            <v-combobox
              label="منتشر شده روی (فارسی)"
              v-model="form.released_on_fa"
              multiple
              chips
              variant="outlined"
              density="comfortable"
              hide-details
            />
          </v-col>

          <v-col cols="12">
            <v-combobox
              label="نواقص (انگلیسی)"
              v-model="form.defects_en"
              multiple
              chips
              variant="outlined"
              density="comfortable"
              hide-details
              dir="ltr"
            />
          </v-col>

          <v-col cols="12">
            <v-combobox
              label="نواقص (فارسی)"
              v-model="form.defects_fa"
              multiple
              chips
              variant="outlined"
              density="comfortable"
              hide-details
            />
          </v-col>

          <v-col cols="12" md="6">
            <v-textarea
              label="نکات (فارسی)"
              v-model="form.notes_fa"
              multiple
              chips
              variant="outlined"
              density="comfortable"
              hide-details
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-textarea
              label="نکات (انگلیسی)"
              v-model="form.notes_en"
              multiple
              chips
              variant="outlined"
              density="comfortable"
              hide-details
            />
          </v-col>

          <v-col cols="12" md="6">
            <BaseRichEditor v-model="form.content_fa" placeholder="متن (فارسی)" />
          </v-col>

          <v-col cols="12" md="6">
            <BaseRichEditor v-model="form.content_en" placeholder="متن (انگلیسی)" />
          </v-col>

          <v-col cols="12" md="6">
            <Codemirror
              dir="ltr"
              v-model="form.tgfiles"
              placeholder="مشخصات فایل‌ها (تلگرامی)"
              :style="{ height: '200px' }"
              :autofocus="true"
              :indent-with-tab="true"
              :tab-size="2"
              :extensions="[json()]"
            />
          </v-col>

          <v-col cols="12" md="6">
            <Codemirror
              dir="ltr"
              v-model="form.files"
              placeholder="مشخصات فایل‌ها"
              :style="{ height: '200px' }"
              :autofocus="true"
              :indent-with-tab="true"
              :tab-size="2"
              :extensions="[json()]"
            />
          </v-col>

          <v-col cols="12">
            <v-card>
              <v-card-item>
                <v-card-title>
                  <span class="text-h6">پیوند به بیرون</span>
                </v-card-title>

                <template v-slot:append>
                  <v-dialog v-model="linkDialog" max-width="500px">
                    <template v-slot:activator="{ props }">
                      <v-btn
                        color="primary"
                        v-bind="props"
                        @click="linkForm = { title_fa: '', title_en: '', url: '' }"
                      >
                        پیوند جدید
                      </v-btn>
                    </template>
                    <v-form
                      @submit.prevent="
                        if (!form.links) {
                          form.links = [];
                        }
                        if (selectedLinkIndex) {
                        } else {
                          form.links.push(linkForm);
                        }
                        linkDialog = false;
                      "
                    >
                      <v-card>
                        <v-card-text>
                          <v-container>
                            <v-row>
                              <v-col cols="12" sm="6">
                                <v-text-field v-model="linkForm.title_fa" label="عنوان فارسی" />
                              </v-col>
                              <v-col cols="12" sm="6">
                                <v-text-field v-model="linkForm.title_en" label="عنوان انگلیسی" />
                              </v-col>
                              <v-col cols="12">
                                <v-text-field v-model="linkForm.url" label="پیوند" />
                              </v-col>
                            </v-row>
                          </v-container>
                        </v-card-text>
                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn color="blue-darken-1" variant="text" @click="linkDialog = false">
                            بستن
                          </v-btn>
                          <v-btn color="blue-darken-1" variant="text" type="submit"> ذخیره </v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-form>
                  </v-dialog>
                </template>
              </v-card-item>

              <v-divider />
              <v-data-table
                :headers="[
                  {
                    title: 'عنوان فارسی',
                    key: 'title_fa'
                  },
                  {
                    title: 'عنوان انگلیسی',
                    key: 'title_en'
                  },
                  {
                    title: 'پیوند',
                    key: 'url'
                  },
                  {
                    title: 'عملیات',
                    key: 'actions',
                    align: 'end'
                  }
                ]"
                :items="form.links"
                :items-per-page="-1"
                hide-default-footer
              >
                <template v-slot:item.actions="{ item }">
                  <!-- <v-icon class="me-2" size="small" @click="editItem(item)"> mdi-pencil </v-icon> -->
                  <v-icon size="small" @click="form.links.splice(form.links.indexOf(item), 1)">
                    mdi-delete
                  </v-icon>
                </template>
              </v-data-table>
            </v-card>
          </v-col>

          <v-col cols="12">
            <v-card>
              <v-card-item>
                <v-card-title>
                  <span class="text-h6">تصاویر</span>
                </v-card-title>

                <template v-slot:append>
                  <v-btn
                    color="primary"
                    text="افزودن تصویر"
                    @click="
                      async () => {
                        const photo = await helper.imageFileInputToBase64();
                        form.photos.push({ dataURL: photo });
                      }
                    "
                  />
                </template>
              </v-card-item>

              <v-divider />
              <v-card-text>
                <div class="d-flex ga-4">
                  <div v-for="(photo, index) in form.photos" :key="index" class="text-center">
                    <v-img :width="300" cover :src="photo.url ?? photo.dataURL" />
                    <v-btn
                      class="mt-2"
                      color="red-lighten-1"
                      icon="mdi-delete"
                      density="comfortable"
                      @click="form.photos.splice(index, 1)"
                    />
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12">
            <v-card>
              <v-card-item>
                <v-card-title>
                  <span class="text-h6">مشارکت‌ها</span>
                </v-card-title>

                <template v-slot:append>
                  <v-btn color="primary" text="افزودن مشارکت" @click="form.contributes.push({})" />
                </template>
              </v-card-item>

              <v-divider />
              <v-card-text class="d-flex flex-column ga-3">
                <div
                  v-for="(contribute, index) in form.contributes"
                  :key="index"
                  class="d-flex justify-space-between align-center"
                >
                  <v-row>
                    <v-col cols="12" md="6">
                      <v-autocomplete
                        v-model="contribute.user_id"
                        :rules="[(val) => !!val || 'Field is required']"
                        label="کاربر"
                        hide-details
                        required
                        density="comfortable"
                        variant="outlined"
                        :items="users.users"
                        item-title="name"
                        item-value="id"
                      />
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-select
                        v-model="contribute.contribute"
                        :rules="[(val) => !!val || 'Field is required']"
                        label="مشارکت"
                        hide-details
                        required
                        density="comfortable"
                        variant="outlined"
                        :items="[
                          'تهیه بازی',
                          'تهیه نسخه فیزیکی',
                          'آپلود بازی',
                          'انتقال/تبدیل فایل',
                          'تهیه تصویر',
                          'تهیه کتابچه',
                          'ویرایش تصویر',
                          'مهندسی معکوس',
                          'نگارش مشخصات'
                        ]"
                      />
                    </v-col>
                  </v-row>
                  <div>
                    <v-menu>
                      <template v-slot:activator="{ props }">
                        <v-btn
                          v-bind="props"
                          variant="text"
                          density="comfortable"
                          icon="mdi-dots-vertical"
                        ></v-btn>
                      </template>
                      <v-list>
                        <v-list-item @click="form.contributes.splice(index, 1)">
                          <v-list-item-title>حذف</v-list-item-title>
                        </v-list-item>
                      </v-list>
                    </v-menu>
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-text class="d-flex justify-end">
        <v-btn color="primary" text="ذخیره" type="submit" :loading="loading" />
      </v-card-text>
    </v-card>
  </v-form>
</template>
