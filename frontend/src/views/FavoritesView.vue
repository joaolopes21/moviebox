<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import axios from 'axios';
import AppHeader from '../components/AppHeader.vue';
const API_BASE = 'http://localhost:3000';
const router = useRouter();
const authStore = useAuthStore();
const favorites = ref([]);
const pending = ref(true);
const error = ref(false);
const loadFavorites = async () => {
  try {
    const response = await axios.get(
      `${API_BASE}/favorites/${authStore.userId}`,
    );
    favorites.value = response.data;
  } catch (err) {
    error.value = true;
  } finally {
    pending.value = false;
  }
};
const removeFavorite = async (movieId: number) => {
  if (!confirm('Remover este filme dos favoritos?')) return;
  try {
    await axios.delete(`${API_BASE}/favorites/${authStore.userId}/${movieId}`);
    favorites.value = favorites.value.filter((f: any) => f.movieId !== movieId);
  } catch (err: any) {
    alert(err.response?.data?.message || 'Erro ao remover favorito');
  }
};
const goToMovie = (movieId: number) => {
  router.push(`/movies/${movieId}`);
};
const getPosterUrl = (path: string | null) => {
  return path
    ? `https://image.tmdb.org/t/p/w500${path}`
    : 'https://via.placeholder.com/500x750/667eea/ffffff?text=Sem+Poster';
};
onMounted(() => {
  loadFavorites();
});
</script>
<template>
  <div>
    <AppHeader />
    <div class="container">
      <h1 class="page-title">Meus filmes favoritos</h1>
      <div v-if="pending" class="loading">
        <div class="spinner"></div>
        <p>Carregando</p>
      </div>
      <div v-else-if="error" class="error">Erro ao carregar favoritos</div>
      <div v-else-if="favorites.length === 0" class="empty">
        <div class="empty-icon"></div>
        <p>Você ainda não possui filmes favoritos</p>
        <button @click="router.push('/')" class="btn-explore">
          Explorar Filmes
        </button>
      </div>
      <div v-else class="movies-grid">
        <div
          v-for="favorite in favorites"
          :key="favorite.id"
          class="movie-card"
        >
          <div class="poster-container" @click="goToMovie(favorite.movieId)">
            <img
              :src="getPosterUrl(favorite.moviePoster)"
              :alt="favorite.movieTitle"
            />
            <div class="overlay">
              <span class="view-details">Ver Detalhes</span>
            </div>
          </div>
          <div class="info">
            <h3 class="title">{{ favorite.movieTitle }}</h3>
            <div class="meta">
              <span class="rating">
                {{ favorite.movieRating?.toFixed(1) }}</span
              >
              <span class="year">{{ favorite.movieYear }}</span>
            </div>
            <button
              @click="removeFavorite(favorite.movieId)"
              class="btn-remove"
            >
              Remover
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.page-title {
  text-align: center;
  font-size: 32px;
  color: #2c3e50;
  margin-bottom: 40px;
  font-weight: 700;
}
.movies-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 24px;
}
.movie-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}
.movie-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}
.poster-container {
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.poster-container img {
  width: 100%;
  height: 350px;
  object-fit: cover;
  display: block;
  transition: transform 0.3s ease;
}
.poster-container:hover img {
  transform: scale(1.05);
}
.overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}
.poster-container:hover .overlay {
  opacity: 1;
}
.view-details {
  color: white;
  font-weight: 600;
  padding: 12px 24px;
  border: 2px solid white;
  border-radius: 8px;
}
.info {
  padding: 16px;
}
.title {
  margin: 0 0 10px 0;
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.meta {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
}
.rating {
  color: #f39c12;
  font-weight: 700;
  font-size: 14px;
}
.year {
  color: #7f8c8d;
  font-size: 14px;
  font-weight: 500;
}
.btn-remove {
  width: 100%;
  padding: 10px;
  background: #e74c3c;
  color: white;
  font-size: 14px;
}
.btn-remove:hover {
  background: #c0392b;
}
.empty {
  text-align: center;
  padding: 80px 20px;
}
.empty-icon {
  font-size: 80px;
  margin-bottom: 20px;
}
.empty p {
  font-size: 20px;
  color: #7f8c8d;
  margin-bottom: 30px;
}
.btn-explore {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 14px 32px;
  font-size: 16px;
}
.btn-explore:hover {
  background: linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%);
}
.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
