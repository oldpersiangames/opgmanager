import { createRouter, createWebHashHistory } from 'vue-router'

import { useAuthStore } from '@/stores/auth';

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  // history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('../layouts/AuthLayout.vue'),
      children: [

        {
          path: '/',
          name: 'HomePage',
          component: () => import('../pages/HomePage.vue')
        },

        {
          path: '/games',
          children: [
            {
              path: '',
              name: 'GamesIndex',
              component: () => import('../pages/GamesIndex.vue')
            },
            {
              path: "create",
              component: () => import("../pages/GamesCreate.vue"),
              name: "GamesCreate",
            },
            {
              path: ':id(\\d+)/edit',
              component: () => import("../pages/GamesEdit.vue"),
              name: "GamesEdit",
            },
          ]
        },

        {
          path: '/lost-games',
          children: [
            {
              path: '',
              name: 'LostGamesIndex',
              component: () => import('../pages/LostGamesIndex.vue')
            },
          ]
        },

        {
          path: "/tgfiles",
          component: () => import("../pages/TGFilesIndex.vue"),
          name: "TGFilesIndex",
        },

      ]
    },


    {
      path: '/',
      component: () => import('../layouts/GuestLayout.vue'),
      meta: { guest: true },
      children: [
        {
          path: 'login',
          name: 'LoginPage',
          component: () => import('../pages/LoginPage.vue')
        },
      ],
    },
  ]
})


router.beforeEach((to) => {
  const auth = useAuthStore();

  if (auth.isLoggedIn && to.meta.guest) {
    return { name: 'HomePage' };
  }

  if (!auth.isLoggedIn && !to.meta.guest) {
    auth.$patch({ returnUrl: to.fullPath });
    return { name: 'LoginPage' };
  }
});

export default router
