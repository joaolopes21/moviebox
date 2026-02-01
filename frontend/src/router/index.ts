import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import LoginView from '../views/LoginView.vue'
import HomeView from '../views/HomeView.vue'
import MovieDetailView from '../views/MovieDetailView.vue'
import FavoritesView from '../views/FavoritesView.vue'
const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/login',
            name: 'login',
            component: LoginView,
            meta: { requiresGuest: true }
        },
        {
            path: '/',
            name: 'home',
            component: HomeView,
            meta: { requiresAuth: true }
        },
        {
            path: '/movies/:id',
            name: 'movie-detail',
            component: MovieDetailView,
            meta: { requiresAuth: true }
        },
        {
            path: '/favorites',
            name: 'favorites',
            component: FavoritesView,
            meta: { requiresAuth: true }
        }
    ]
})
// Guard de autenticação
router.beforeEach((to, from, next) => {
    const authStore = useAuthStore()
    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        next('/login')
    } else if (to.meta.requiresGuest && authStore.isAuthenticated) {
        next('/')
    } else {
        next()
    }
})
export default router