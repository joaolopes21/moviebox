import { Test, TestingModule } from '@nestjs/testing';
import { FavoritesService } from './favorites.service';
import { PrismaService } from '../prisma/prisma.service';
import { HttpException } from '@nestjs/common';

describe('FavoritesService', () => {
  let service: FavoritesService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    favorite: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FavoritesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<FavoritesService>(FavoritesService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('addFavorite', () => {
    it('deve adicionar um filme aos favoritos', async () => {
      const userId = 1;
      const favoriteDto = {
        movieId: 603,
        movieTitle: 'The Matrix',
        moviePoster: '/path.jpg',
        movieRating: 8.7,
      };

      const mockFavorite = {
        id: 1,
        userId: 1,
        ...favoriteDto,
        createdAt: new Date(),
      };

      mockPrismaService.favorite.findUnique.mockResolvedValue(null);
      mockPrismaService.favorite.create.mockResolvedValue(mockFavorite);

      const result = await service.addFavorite(userId, favoriteDto);

      expect(result).toEqual(mockFavorite);
      expect(mockPrismaService.favorite.create).toHaveBeenCalled();
    });

    it('deve lançar erro se favorito já existe', async () => {
      const userId = 1;
      const favoriteDto = {
        movieId: 603,
        movieTitle: 'The Matrix',
        moviePoster: '/path.jpg',
        movieRating: 8.7,
      };

      mockPrismaService.favorite.findUnique.mockResolvedValue({
        id: 1,
        userId: 1,
        movieId: 603,
      });

      await expect(service.addFavorite(userId, favoriteDto)).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('getFavorites', () => {
    it('deve retornar lista de favoritos do usuário', async () => {
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

      mockPrismaService.favorite.findMany.mockResolvedValue(mockFavorites);

      const result = await service.getFavorites(userId);

      expect(result).toEqual(mockFavorites);
      expect(mockPrismaService.favorite.findMany).toHaveBeenCalledWith({
        where: { userId },
      });
    });
  });

  describe('checkFavorite', () => {
    it('deve retornar true se filme está nos favoritos', async () => {
      const userId = 1;
      const movieId = 603;

      mockPrismaService.favorite.findUnique.mockResolvedValue({
        id: 1,
        userId,
        movieId,
      });

      const result = await service.checkFavorite(userId, movieId);

      expect(result).toEqual({ isFavorite: true });
    });

    it('deve retornar false se filme não está nos favoritos', async () => {
      const userId = 1;
      const movieId = 603;

      mockPrismaService.favorite.findUnique.mockResolvedValue(null);

      const result = await service.checkFavorite(userId, movieId);

      expect(result).toEqual({ isFavorite: false });
    });
  });

  describe('removeFavorite', () => {
    it('deve remover um favorito', async () => {
      const userId = 1;
      const movieId = 603;

      const mockFavorite = {
        id: 1,
        userId,
        movieId,
      };

      mockPrismaService.favorite.findUnique.mockResolvedValue(mockFavorite);
      mockPrismaService.favorite.delete.mockResolvedValue(mockFavorite);

      const result = await service.removeFavorite(userId, movieId);

      expect(result).toBeDefined();
      expect(mockPrismaService.favorite.delete).toHaveBeenCalled();
    });

    it('deve lançar erro se favorito não existe', async () => {
      const userId = 1;
      const movieId = 603;

      mockPrismaService.favorite.findUnique.mockResolvedValue(null);

      await expect(service.removeFavorite(userId, movieId)).rejects.toThrow(
        HttpException,
      );
    });
  });
});
