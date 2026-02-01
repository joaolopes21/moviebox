import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class MoviesService {
  private readonly apiKey = process.env.TMDB_API_KEY;
  private readonly baseUrl = 'https://api.themoviedb.org/3';

  async getPopularMovies(page: number = 1) {
    try {
      console.log('API Key:', this.apiKey ? 'Configurada' : 'NÃO CONFIGURADA!');
      const url = `${this.baseUrl}/movie/popular?api_key=${this.apiKey}&language=pt-BR&page=${page}`;

      const response = await axios.get(url);
      return response.data;
    } catch (error: any) {
      console.error('Erro ao buscar filmes:', error.message);
      console.error('Detalhes:', error.response?.data);
      throw new HttpException(
        error.response?.data?.status_message || 'Erro ao buscar filmes',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async searchMovies(query: string, page: number = 1) {
    try {
      const url = `${this.baseUrl}/search/movie?api_key=${this.apiKey}&language=pt-BR&query=${encodeURIComponent(query)}&page=${page}`;

      const response = await axios.get(url);
      return response.data;
    } catch (error: any) {
      console.error('Erro ao buscar filmes:', error.message);
      console.error('Detalhes:', error.response?.data);
      throw new HttpException(
        error.response?.data?.status_message || 'Erro ao buscar filmes',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getMovieDetails(id: number) {
    try {
      const url = `${this.baseUrl}/movie/${id}?api_key=${this.apiKey}&language=pt-BR`;

      const response = await axios.get(url);
      return response.data;
    } catch (error: any) {
      console.error('Erro ao buscar detalhes do filme:', error.message);
      console.error('Detalhes:', error.response?.data);
      throw new HttpException(
        error.response?.data?.status_message ||
          'Erro ao buscar detalhes do filme',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
