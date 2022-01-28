import { createRouter, createWebHistory } from '/modules/vue-router.js'
import { isAuthenticated } from '/src/store/userStore.js'

const dialogRouteFunc = (to, from, component) => {
  const fromMatch = from.matched[0]
  const toMatch = to.matched[0]

  fromMatch && (toMatch.components.default = fromMatch.components.default)
  !fromMatch &&
    (toMatch.components.default = () => import('../views/HomeView.js'))
  toMatch.components['dialog-router'] = () => import(component)
}

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => {
        if (isAuthenticated.value) return import('../views/HomeView.js')
        return import('../views/SignInView.js')
      },
    },

    {
      path: '/create',
      name: 'create',
      beforeEnter: (to, from) =>
        dialogRouteFunc(
          to,
          from,
          '../components/header/HeaderNewPostDialog.js'
        ),
    },

    {
      path: '/explore',
      name: 'explore',
      component: () => import('../views/ExploreView.js'),
    },

    {
      path: '/direct',
      name: 'direct',
      children: [
        {
          path: 't/:id',
          name: 'direct-thread',
          component: () => import('../views/DirectView.js'),
        },
      ],

      component: () => import('../views/DirectView.js'),
    },

    {
      path: '/:username(.*)*',
      name: 'profile',
      component: () => import('../views/UserProfileView.js'),
    },

    {
      path: '/p/:id',
      name: 'post',
      beforeEnter: (to, from) =>
        dialogRouteFunc(to, from, '../components/profile/PostDialog.js'),
    },

    {
      path: '/settings',
      name: 'settings',
      component: () => import('../views/SettingsView.js'),
    },
  ],
})

const dialogNames = ['create', 'post']

export { dialogNames }
export default router
