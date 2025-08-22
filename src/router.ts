import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL ?? '/'),
    routes: [
        {
            path: '/',
            name: 'home',
            component: () => import('./components/HomeView.vue')
        },
        {
            path: '/users',
            name: 'users',
            component: () => import('./components/UserManagement.vue')
        },
        {
            path: '/products',
            name: 'products',
            component: () => import('./components/ProductManagement.vue')
        }
    ]
})

export default router