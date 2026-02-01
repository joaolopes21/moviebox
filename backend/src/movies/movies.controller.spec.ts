import { Test, TestingModule } from '@nestjs/testing';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';

describe('MoviesController', () => {
  let controller: MoviesController;
  let moviesService: MoviesService;

  const mockMoviesService = {
    getPopularMovies: jest.fn(),
    searchMovies: jest.fn(),
    getMovieDetails: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoviesController],
      providers: [
        {
          provide: MoviesService,
          useValue: mockMoviesService,
        },
      ],
    }).compile();

    controller = module.get<MoviesController>(MoviesController);
    moviesService = module.get<MoviesService>(MoviesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getPopularMovies', () => {
    it('deve retornar filmes populares', async () => {
      const mockResponse = {
        page: 1,
        results: [
          {
            id: 603,
            title: 'The Matrix',
            poster_path: '/path.jpg',
            vote_average: 8.7,
          },
        ],
        total_pages: 500,
        total_results: 10000,
      };

      mockMoviesService.getPopularMovies.mockResolvedValue(mockResponse);

      const result = await controller.getPopularMovies();

      expect(moviesService.getPopularMovies).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('searchMovies', () => {
    it('deve buscar filmes por query', async () => {
      const query = 'Matrix';
      const mockResponse = {
        page: 1,
        results: [
          {
            id: 603,
            title: 'The Matrix',
            poster_path: '/path.jpg',
            vote_average: 8.7,
          },
        ],
        total_pages: 10,
        total_results: 100,
      };

      mockMoviesService.searchMovies.mockResolvedValue(mockResponse);

      const result = await controller.searchMovies(query, '1');

      expect(moviesService.searchMovies).toHaveBeenCalledWith(query, 1);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getMovieDetails', () => {
    it('deve retornar detalhes de um filme', async () => {
      const movieId = '603';
      const mockMovie = {
        id: 603,
        title: 'The Matrix',
        overview: 'A computer hacker learns...',
        poster_path: '/path.jpg',
        backdrop_path: '/backdrop.jpg',
        vote_average: 8.7,
        release_date: '1999-03-31',
        runtime: 136,
        genres: [{ id: 28, name: 'Action' }],
      };

      mockMoviesService.getMovieDetails.mockResolvedValue(mockMovie);

      const result = await controller.getMovieDetails(movieId);

      expect(moviesService.getMovieDetails).toHaveBeenCalledWith(603);
      expect(result).toEqual(mockMovie);
    });
  });
});
