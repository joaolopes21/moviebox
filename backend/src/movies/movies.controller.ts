import { Controller, Get, Param, Query } from '@nestjs/common';
import { MoviesService } from './movies.service';

@Controller('movies')
export class MoviesController {
  constructor(private moviesService: MoviesService) {}

  @Get('popular')
  async getPopularMovies(@Query('page') page: string = '1') {
    return this.moviesService.getPopularMovies(parseInt(page));
  }

  @Get('search')
  async searchMovies(
    @Query('query') query: string,
    @Query('page') page: string = '1',
  ) {
    return this.moviesService.searchMovies(query, parseInt(page));
  }

  @Get(':id')
  async getMovieDetails(@Param('id') id: string) {
    return this.moviesService.getMovieDetails(parseInt(id));
  }
}
