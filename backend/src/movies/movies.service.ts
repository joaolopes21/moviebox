import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { SearchMoviesDto } from './dto/searchmovies.dto';

@Injectable()
export class MoviesService {
    private readonly apiKey = process.env.TMDB_KEY;
    private readonly baseUrl = 'https://api.themoviedb.org/3';
    constructor(private readonly httpService: HttpService) { }
    async searchMovies(searchDto: SearchMoviesDto) {
        const { query, page } = searchDto;
        const response = await firstValueFrom(
            this.httpService.get(`${this.baseUrl}/search/movie`, {
                params: {
                    api_key: this.apiKey,
                    language: 'pt-BR',
                    query,
                    page
                }
            })
        );
        return response.data;
    }
}