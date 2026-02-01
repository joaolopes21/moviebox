import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'
const API_BASE = 'http://localhost:3000'
export const useAuthStore = defineStore('auth', () => {
    const user = ref<any>(null)
    const userId = ref<number | null>(null)
    const isAuthenticated = computed(() => !!userId.value)
    const userName = computed(() => user.value?.name || '')
    const init = () => {
        const savedUserId = localStorage.getItem('userId')
        const savedUser = localStorage.getItem('user')
        if (savedUserId && savedUser) {
            userId.value = parseInt(savedUserId)
            user.value = JSON.parse(savedUser)
        }
    }
    const register = async (data: { name: string; email: string; password: string }) => {
        try {
            const response = await axios.post(`${API_BASE}/auth/register`, data)
            user.value = response.data.user
            userId.value = response.data.user.id
            localStorage.setItem('userId', response.data.user.id.toString())
            localStorage.setItem('user', JSON.stringify(response.data.user))
            return response.data
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Erro ao cadastrar')
        }
    }
    const login = async (data: { email: string; password: string }) => {
        try {
            const response = await axios.post(`${API_BASE}/auth/login`, data)
            user.value = response.data.user
            userId.value = response.data.user.id
            localStorage.setItem('userId', response.data.user.id.toString())
            localStorage.setItem('user', JSON.stringify(response.data.user))
            return response.data
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Email ou senha incorretos')
        }
    }
    const logout = () => {
        user.value = null
        userId.value = null
        localStorage.removeItem('userId')
        localStorage.removeItem('user')
    }
    return {
        user,
        userId,
        isAuthenticated,
        userName,
        init,
        register,
        login,
        logout
    }
})