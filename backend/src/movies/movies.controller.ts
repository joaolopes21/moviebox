import { Controller, Get, Query } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { SearchMoviesDto } from './dto/searchmovies.dto';


@Controller('movies')
export class MoviesController {
    constructor(private readonly moviesService: MoviesService) { }
    @Get('search')
    async search(@Query() searchDto: SearchMoviesDto) {
        return this.moviesService.searchMovies(searchDto);
    }
}
