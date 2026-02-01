import { Test, TestingModule } from '@nestjs/testing';
import { FavoritesController } from './favorites.controller';
import { FavoritesService } from './favorites.service';

describe('FavoritesController', () => {
  let controller: FavoritesController;
  let favoritesService: FavoritesService;

  const mockFavoritesService = {
    addFavorite: jest.fn(),
    getFavorites: jest.fn(),
    checkFavorite: jest.fn(),
    removeFavorite: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FavoritesController],
      providers: [
        {
          provide: FavoritesService,
          useValue: mockFavoritesService,
        },
      ],
    }).compile();

    controller = module.get<FavoritesController>(FavoritesController);
    favoritesService = module.get<FavoritesService>(FavoritesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('addFavorite', () => {
    it('deve adicionar um favorito', async () => {
      const userId = 1;
      const favoriteDto = {
        movieId: 603,
        movieTitle: 'The Matrix',
        moviePoster: '/path.jpg',
        movieRating: 8.7,
      };

      const mockResult = {
        id: 1,
        userId: 1,
        ...favoriteDto,
        createdAt: new Date(),
      };

      mockFavoritesService.addFavorite.mockResolvedValue(mockResult);

      const result = await controller.addFavorite(userId, favoriteDto);

      expect(favoritesService.addFavorite).toHaveBeenCalledWith(
        userId,
        favoriteDto,
      );
      expect(result).toEqual(mockResult);
    });
  });

  describe('getFavorites', () => {
    it('deve retornar favoritos do usuário', async () => {
      const userId = 1;
      const mockFavorites = [
        {
          id: 1,
          userId: 1,
          movieId: 603,
          movieTitle: 'The Matrix',
          moviePoster: '/path.jpg',
          movieRating: 8.7,
          createdAt: new Date(),
        },
      ];

      mockFavoritesService.getFavorites.mockResolvedValue(mockFavorites);

      const result = await controller.getFavorites(userId);

      expect(favoritesService.getFavorites).toHaveBeenCalledWith(userId);
      expect(result).toEqual(mockFavorites);
    });
  });

  describe('checkFavorite', () => {
    it('deve verificar se filme é favorito', async () => {
      const userId = 1;
      const movieId = 603;

      mockFavoritesService.checkFavorite.mockResolvedValue({
        isFavorite: true,
      });

      const result = await controller.checkFavorite(userId, movieId);

      expect(favoritesService.checkFavorite).toHaveBeenCalledWith(
        userId,
        movieId,
      );
      expect(result).toEqual({ isFavorite: true });
    });
  });

  describe('removeFavorite', () => {
    it('deve remover um favorito', async () => {
      const userId = 1;
      const movieId = 603;

      mockFavoritesService.removeFavorite.mockResolvedValue({
        message: 'Favorito removido com sucesso',
      });

      const result = await controller.removeFavorite(userId, movieId);

      expect(favoritesService.removeFavorite).toHaveBeenCalledWith(
        userId,
        movieId,
      );
      expect(result).toHaveProperty('message');
    });
  });
});
