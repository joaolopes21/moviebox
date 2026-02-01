<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
const router = useRouter();
const authStore = useAuthStore();
const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};
</script>
<template>
  <header class="header">
    <div class="header-content">
      <h1 @click="router.push('/')" class="logo">MovieBox</h1>
      <nav class="nav">
        <router-link to="/" class="nav-link">Home</router-link>
        <router-link to="/favorites" class="nav-link">Favoritos</router-link>
        <span class="user-name">Olá, {{ authStore.userName }}!</span>
        <button @click="handleLogout" class="btn-logout">Sair</button>
      </nav>
    </div>
  </header>
</template>
<style scoped>
.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}
.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 15px;
}
.logo {
  cursor: pointer;
  font-size: 24px;
  margin: 0;
  font-weight: 700;
  transition: transform 0.3s ease;
}
.logo:hover {
  transform: scale(1.05);
}
.nav {
  display: flex;
  gap: 25px;
  align-items: center;
  flex-wrap: wrap;
}
.nav-link {
  color: white;
  text-decoration: none;
  font-weight: 500;
  font-size: 16px;
  transition: opacity 0.3s ease;
}
.nav-link:hover {
  opacity: 0.8;
}
.user-name {
  font-weight: 600;
  font-size: 14px;
}
.btn-logout {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  padding: 8px 20px;
  backdrop-filter: blur(10px);
}
.btn-logout:hover {
  background: rgba(255, 255, 255, 0.3);
}
</style>
