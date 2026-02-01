<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import AppHeader from '../components/AppHeader.vue';
import MovieCard from '../components/MovieCard.vue';

const API_BASE = 'http://localhost:3000';

const searchQuery = ref('');
const page = ref(1);
const movies = ref([]);
const pending = ref(false);
const error = ref(false);
const hasNextPage = ref(true);

let searchTimeout: any = null;

const loadMovies = async () => {
  pending.value = true;
  error.value = false;

  try {
    const endpoint = searchQuery.value
      ? `/movies/search?query=${encodeURIComponent(searchQuery.value)}&page=${page.value}`
      : `/movies/popular?page=${page.value}`;

    console.log('Buscando:', `${API_BASE}${endpoint}`);

    const response = await axios.get(`${API_BASE}${endpoint}`);

    console.log('Resposta:', response.data);

    movies.value = response.data.results || [];
    hasNextPage.value = page.value < (response.data.total_pages || 1);
  } catch (err: any) {
    console.error('Erro ao carregar filmes:', err);
    console.error('Detalhes do erro:', err.response?.data);
    error.value = true;
  } finally {
    pending.value = false;
  }
};

const handleSearch = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    page.value = 1;
    loadMovies();
  }, 500);
};

const prevPage = () => {
  if (page.value > 1) {
    page.value--;
    loadMovies();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

const nextPage = () => {
  if (hasNextPage.value) {
    page.value++;
    loadMovies();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

onMounted(() => {
  loadMovies();
});
</script>

<template>
  <div>
    <AppHeader />

    <div class="container">
      <div class="search-section">
        <h1 class="page-title">Explorar filmes</h1>
        <div class="search-bar">
          <input
            v-model="searchQuery"
            @input="handleSearch"
            type="text"
            placeholder="Buscar filmes..."
            class="search-input"
          />
        </div>
      </div>

      <div v-if="pending" class="loading">
        <div class="spinner"></div>
        <p>Carregando filmes...</p>
      </div>

      <div v-else-if="error" class="error">
        <p>Erro ao carregar</p>
        <button @click="loadMovies" class="btn-retry">Tentar Novamente</button>
      </div>

      <div v-else>
        <h2 class="section-title">
          {{
            searchQuery
              ? `Resultados para "${searchQuery}"`
              : 'Filmes Populares'
          }}
        </h2>

        <div v-if="movies.length === 0" class="empty">
          Nenhum filme encontrado.
        </div>

        <div v-else class="movies-grid">
          <MovieCard v-for="movie in movies" :key="movie.id" :movie="movie" />
        </div>

        <div v-if="movies.length > 0" class="pagination">
          <button @click="prevPage" :disabled="page === 1" class="btn-page">
            ← Anterior
          </button>
          <span class="page-info">Página {{ page }}</span>
          <button @click="nextPage" :disabled="!hasNextPage" class="btn-page">
            Próxima →
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.search-section {
  margin-bottom: 40px;
}

.page-title {
  text-align: center;
  font-size: 32px;
  color: #2c3e50;
  margin-bottom: 20px;
  font-weight: 700;
}

.search-bar {
  position: relative;
  max-width: 600px;
  margin: 0 auto;
}

.search-input {
  font-size: 16px;
  padding: 16px 50px 16px 20px;
  border-radius: 50px;
  border: 2px solid #e1e8ed;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  width: 100%;
}

.search-input:focus {
  border-color: #667eea;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
  outline: none;
}

.search-icon {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 20px;
}

.section-title {
  margin-bottom: 25px;
  color: #2c3e50;
  font-size: 24px;
  font-weight: 600;
}

.movies-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 50px;
}

.btn-page {
  padding: 12px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-page:hover:not(:disabled) {
  background: linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.btn-page:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.page-info {
  font-weight: 600;
  color: #2c3e50;
  font-size: 16px;
}

.loading,
.error,
.empty {
  text-align: center;
  padding: 60px 20px;
  font-size: 18px;
}

.error {
  color: #e74c3c;
}

.error-detail {
  font-size: 14px;
  color: #7f8c8d;
  margin-top: 10px;
}

.btn-retry {
  margin-top: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-retry:hover {
  background: linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.empty {
  color: #95a5a6;
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
  .movies-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 16px;
  }

  .page-title {
    font-size: 24px;
  }
}
</style>
