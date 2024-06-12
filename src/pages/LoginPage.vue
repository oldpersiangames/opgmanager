<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import type { SubmitEventPromise } from 'vuetify'

const auth = useAuthStore()
const router = useRouter()
const form = ref({
  email: '',
  password: '',
  remember: false
})
const isPasswordVisible = ref(false)
const loading = ref(false)

async function login(event: SubmitEventPromise) {
  if (!(await event).valid) {
    return
  }
  loading.value = true

  await auth.login(form.value)
  router.push(auth.returnUrl || { name: 'HomePage' })
  auth.$patch({ returnUrl: null })

  loading.value = false
}
</script>
<template>
  <v-card width="100%" max-width="448">
    <v-card-item class="justify-center" dir="ltr">
      <template #prepend>
        <div class="d-flex align-center">
          <v-img src="/src/assets/logo.png" width="40" />
        </div>
      </template>

      <v-card-title class="text-h6 text-uppercase"> OPG Manager </v-card-title>
    </v-card-item>

    <v-card-text class="pt-2">
      <h5 class="text-h5 font-weight-semibold mb-6">سلام 👋🏻</h5>

      <v-form @submit.prevent="login">
        <v-row>
          <v-col cols="12">
            <v-text-field
              dir="ltr"
              v-model="form.email"
              label="ایمیل"
              type="email"
              variant="outlined"
              :rules="[(v) => !!v || 'اجباریه.', (v) => /.+@.+\..+/.test(v) || 'درست نیست.']"
            />
          </v-col>

          <v-col cols="12">
            <v-text-field
              dir="ltr"
              v-model="form.password"
              label="گذرواژه"
              placeholder="············"
              :type="isPasswordVisible ? 'text' : 'password'"
              :append-inner-icon="isPasswordVisible ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
              @click:append-inner="isPasswordVisible = !isPasswordVisible"
              variant="outlined"
              :rules="[(v) => !!v || 'اجباریه.']"
            />

            <div class="d-flex align-center justify-space-between flex-wrap mb-4">
              <v-checkbox v-model="form.remember" label="من را به خاطر بسپار" hide-details />

              <!-- <v-btn to="/forgot" variant="text" text="رمزت رو فراموش کردی؟" /> -->
            </div>

            <v-btn block type="submit" :loading="loading" color="primary" text="ورود" />
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
  </v-card>
</template>
