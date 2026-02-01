<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import axios from 'axios';
import AppHeader from '../components/AppHeader.vue';

const API_BASE = 'http://localhost:3000';

const route = useRoute();
const authStore = useAuthStore();

const movieId = route.params.id;
const movie = ref<any>(null);
const pending = ref(true);
const error = ref(false);
const isFavorite = ref(false);
const loadingFavorite = ref(false);

const posterUrl = computed(() => {
  return movie.value?.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.value.poster_path}`
    : 'https://via.placeholder.com/500x750/667eea/ffffff?text=Sem+Poster';
});

const backdropUrl = computed(() => {
  return movie.value?.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.value.backdrop_path}`
    : '';
});

const loadMovie = async () => {
  try {
    const response = await axios.get(`${API_BASE}/movies/${movieId}`);
    movie.value = response.data;
    await checkFavorite();
  } catch (err) {
    console.error('Erro ao carregar filme:', err);
    error.value = true;
  } finally {
    pending.value = false;
  }
};

const checkFavorite = async () => {
  try {
    const response = await axios.get(
      `${API_BASE}/favorites/${authStore.userId}/check/${movieId}`,
    );
    isFavorite.value = response.data.isFavorite;
  } catch (err) {
    console.error('Erro ao verificar favorito:', err);
  }
};

const toggleFavorite = async () => {
  loadingFavorite.value = true;

  try {
    if (isFavorite.value) {
      await axios.delete(
        `${API_BASE}/favorites/${authStore.userId}/${movieId}`,
      );
      isFavorite.value = false;
      alert('Removido dos favoritos!');
    } else {
      await axios.post(`${API_BASE}/favorites/${authStore.userId}`, {
        movieId: parseInt(movieId as string),
        movieTitle: movie.value.title,
        moviePoster: movie.value.poster_path,
        movieRating: movie.value.vote_average,
        movieYear: movie.value.release_date?.split('-')[0],
      });
      isFavorite.value = true;
      alert('Adicionado aos favoritos!');
    }
  } catch (err: any) {
    console.error('Erro ao atualizar favorito:', err);
    alert(err.response?.data?.message || 'Erro ao atualizar favorito');
  } finally {
    loadingFavorite.value = false;
  }
};

onMounted(() => {
  loadMovie();
});
</script>

<template>
  <div>
    <AppHeader />

    <div class="movie-details">
      <div v-if="pending" class="loading">
        <div class="spinner"></div>
        <p>Carregando..</p>
      </div>

      <div v-else-if="error" class="error">Erro ao carregar filme</div>

      <div v-else-if="movie" class="content">
        <div
          class="backdrop"
          :style="{ backgroundImage: `url(${backdropUrl})` }"
        >
          <div class="backdrop-overlay"></div>
        </div>

        <div class="info-container">
          <img :src="posterUrl" :alt="movie.title" class="poster" />

          <div class="info">
            <h1 class="title">{{ movie.title }}</h1>
            <p v-if="movie.tagline" class="tagline">{{ movie.tagline }}</p>

            <div class="meta">
              <span class="rating">⭐ {{ movie.vote_average.toFixed(1) }}</span>
              <span class="year">{{ movie.release_date?.split('-')[0] }}</span>
              <span v-if="movie.runtime" class="runtime"
                >⏱️ {{ movie.runtime }} min</span
              >
            </div>

            <div v-if="movie.genres" class="genres">
              <span v-for="genre in movie.genres" :key="genre.id" class="genre">
                {{ genre.name }}
              </span>
            </div>

            <p class="overview">{{ movie.overview }}</p>

            <button
              @click="toggleFavorite"
              :disabled="loadingFavorite"
              :class="['btn-favorite', { 'is-favorite': isFavorite }]"
            >
              {{
                isFavorite ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos'
              }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.backdrop {
  height: 500px;
  background-size: cover;
  background-position: center;
  position: relative;
}

.backdrop-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.2),
    rgba(245, 247, 250, 1)
  );
}

.info-container {
  max-width: 1200px;
  margin: -250px auto 0;
  padding: 0 20px 40px;
  display: flex;
  gap: 40px;
  position: relative;
  z-index: 1;
}

.poster {
  width: 300px;
  height: 450px;
  object-fit: cover;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  flex-shrink: 0;
}

.info {
  flex: 1;
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.title {
  font-size: 36px;
  margin: 0 0 10px 0;
  color: #2c3e50;
  font-weight: 700;
}

.tagline {
  font-style: italic;
  color: #7f8c8d;
  margin: 0 0 20px 0;
  font-size: 16px;
}

.meta {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  font-size: 16px;
  flex-wrap: wrap;
}

.rating {
  color: #f39c12;
  font-weight: 700;
  font-size: 18px;
}

.year,
.runtime {
  color: #7f8c8d;
  font-weight: 600;
}

.genres {
  display: flex;
  gap: 10px;
  margin-bottom: 25px;
  flex-wrap: wrap;
}

.genre {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
}

.overview {
  line-height: 1.8;
  margin-bottom: 30px;
  font-size: 16px;
  color: #34495e;
}

.btn-favorite {
  background: #e74c3c;
  color: white;
  font-size: 16px;
  padding: 14px 32px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-favorite.is-favorite {
  background: #27ae60;
}

.btn-favorite:hover:not(:disabled) {
  background: #c0392b;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.btn-favorite.is-favorite:hover:not(:disabled) {
  background: #229954;
}

.btn-favorite:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.loading,
.error {
  text-align: center;
  padding: 60px 20px;
  font-size: 18px;
}

.error {
  color: #e74c3c;
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

@media (max-width: 768px) {
  .info-container {
    flex-direction: column;
    align-items: center;
    margin-top: -150px;
  }

  .poster {
    width: 250px;
    height: 375px;
  }
}
</style>
