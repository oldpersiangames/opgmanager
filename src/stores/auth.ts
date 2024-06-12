import { defineStore } from 'pinia';
import { api } from '@/utils/axios';
import { computed, ref } from 'vue';
import { useHelper } from '@/composables/helper';
import axios from 'axios';

type User = {
  id: number;
  name: string;
  email: string;
  permissions: Array<string>;
  roles: Array<string>;
};

type Credentials = {
  email: string;
  password: string;
  remember: boolean;
};

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const returnUrl = ref<string | null>(null);
  const isLoggedIn = computed(() => !!user.value);
  const helper = useHelper()
  // const $q = useQuasar();

  async function fetchUser() {
    try {
      const response = await api.get('/api/user');
      user.value = response.data;
    } catch {
      /* empty */
    }
  }

  async function login(credentials: Credentials) {
    try {
      await api.get('/sanctum/csrf-cookie');
      await api.post('/login', credentials);
      await fetchUser();

      helper.notify({
        text: 'خوش اومدی!',
        color: 'green-lighten-1',
      })
    } catch (error) {

      if (axios.isAxiosError(error) && error.response) {
        helper.notify({
          text: error.response.data?.message,
          color: 'red-lighten-1',
        })
      }

    }
  }

  async function logout() {
    await api.post('/logout');
    user.value = null;
  }

  // const can = computed(
  //   () => (permission: string) => {
  //     if (user.value!.roles.includes('Super-Admin')) return true;
  //     return user.value!.permissions.includes(permission)
  //   }
  // );

  // const canany = computed(
  //   () => (permissions: Array<string>) => {
  //     if (user.value!.roles.includes('Super-Admin')) return true;
  //     return permissions.some((e) => user.value!.permissions.includes(e))
  //   }
  // );

  return { user, returnUrl, isLoggedIn, fetchUser, login, logout };
});
