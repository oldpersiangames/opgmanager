<script setup lang="ts">
import { ref } from 'vue';
import { api } from '@/utils/axios';

const lostGames = ref([]);
const loading = ref(false);

const filename = ref('');

async function fetch() {
  loading.value = true;
  const response = await api.get('/api/admin/lost-games');
  lostGames.value = response.data;
  loading.value = false;
}
fetch();
</script>

<template>
  <v-card>
    <v-card-text>
      <v-file-input
        accept="image/*"
        label="آاپلود عکس"
        multiple
        @update:model-value="
          async (files: Array<File>) => {
            await api.postForm('/api/admin/lost-games', {
              files: files
            });
            fetch();
          }
        "
      ></v-file-input>
      <v-row>
        <v-col cols="6" v-for="(lostGame, index) in lostGames" :key="index">
          <v-card>
            <v-img
              class="bg-grey-lighten-2"
              height="425"
              :src="api.defaults.baseURL + '/storage/lost-games/' + lostGame"
            ></v-img>

            <v-list-item>
              <template v-slot:title>
                <v-dialog activator="parent" max-width="340">
                  <template v-slot:activator="{ props: activatorProps }">
                    <v-btn
                      v-bind="activatorProps"
                      append-icon="mdi-pencil"
                      class="text-none"
                      color="primary"
                      variant="text"
                      slim
                      :text="lostGame"
                      @click="filename = lostGame"
                    />
                  </template>
                  <template v-slot:default="{ isActive }">
                    <v-form
                      @submit.prevent="
                        async ($event: any) => {
                          if (!(await $event).valid) {
                            return;
                          }

                          await api.post('/api/admin/lost-games/rename', {
                            old_filename: lostGame,
                            new_filename: filename
                          });
                          await fetch();
                          isActive.value = false;
                        }
                      "
                    >
                      <v-card>
                        <v-card-text
                          ><v-text-field
                            label="File Name"
                            dir="ltr"
                            v-model="filename"
                            required
                          ></v-text-field
                        ></v-card-text>
                        <template v-slot:actions>
                          <v-btn text="بیخیال" @click="isActive.value = false"></v-btn>
                          <v-btn color="primary" text="ذخیره" variant="tonal" type="submit"></v-btn>
                        </template>
                      </v-card>
                    </v-form>
                  </template>
                </v-dialog>
              </template>

              <template v-slot:append>
                <v-dialog max-width="340">
                  <template v-slot:activator="{ props: activatorProps }">
                    <v-btn
                      v-bind="activatorProps"
                      icon="mdi-delete"
                      color="red-lighten-1"
                      variant="text"
                      density="comfortable"
                    />
                  </template>

                  <template v-slot:default="{ isActive }">
                    <v-form
                      @submit.prevent="
                        async ($event: any) => {
                          if (!(await $event).valid) {
                            return;
                          }

                          await api.delete('/api/admin/lost-games/' + lostGame);
                          await fetch();
                          isActive.value = false;
                        }
                      "
                    >
                      <v-card text="مطمئنی؟" title="حذف">
                        <template v-slot:actions>
                          <v-btn text="نه" @click="isActive.value = false"></v-btn>

                          <v-btn color="primary" text="آره" variant="tonal" type="submit"></v-btn>
                        </template>
                      </v-card>
                    </v-form>
                  </template>
                </v-dialog>
              </template>
            </v-list-item>
          </v-card>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>
