<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
const props = defineProps<{
  movie: any;
}>();
const router = useRouter();
const posterUrl = computed(() => {
  return props.movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${props.movie.poster_path}`
    : 'https://via.placeholder.com/500x750/667eea/ffffff?text=Sem+Poster';
});
const releaseYear = computed(() => {
  return props.movie.release_date?.split('-')[0] || 'N/A';
});
const goToDetails = () => {
  router.push(`/movies/${props.movie.id}`);
};
</script>
<template>
  <div class="movie-card" @click="goToDetails">
    <div class="poster-container">
      <img :src="posterUrl" :alt="movie.title" class="poster" />
      <div class="overlay">
        <span class="view-details">Ver Detalhes</span>
      </div>
    </div>
    <div class="info">
      <h3 class="title">{{ movie.title }}</h3>
      <div class="meta">
        <span class="rating"> {{ movie.vote_average.toFixed(1) }}</span>
        <span class="year">{{ releaseYear }}</span>
      </div>
    </div>
  </div>
</template>
<style scoped>
.movie-card {
  cursor: pointer;
  border-radius: 12px;
  overflow: hidden;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}
.movie-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}
.poster-container {
  position: relative;
  overflow: hidden;
}
.poster {
  width: 100%;
  height: 350px;
  object-fit: cover;
  display: block;
  transition: transform 0.3s ease;
}
.movie-card:hover .poster {
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
.movie-card:hover .overlay {
  opacity: 1;
}
.view-details {
  color: white;
  font-weight: 600;
  font-size: 16px;
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
  color: #2c3e50;
  font-weight: 600;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
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
</style>
