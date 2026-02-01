import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFavoriteDto } from './dto/add.dto';

@Injectable()
export class FavoritesService {
  constructor(private prisma: PrismaService) {}

  async addFavorite(userId: number, data: CreateFavoriteDto) {
    const existing = await this.prisma.favorite.findUnique({
      where: {
        userId_movieId: {
          userId,
          movieId: data.movieId,
        },
      },
    });

    if (existing) {
      throw new ConflictException('Filme já está nos favoritos');
    }

    return this.prisma.favorite.create({
      data: {
        userId,
        movieId: data.movieId,
        movieTitle: data.movieTitle,
        moviePoster: data.moviePoster,
        movieRating: data.movieRating,
        movieYear: data.movieYear,
      },
    });
  }

  async getFavorites(userId: number) {
    return this.prisma.favorite.findMany({
      where: { userId },
    });
  }

  async removeFavorite(userId: number, movieId: number) {
    const favorite = await this.prisma.favorite.findUnique({
      where: {
        userId_movieId: {
          userId,
          movieId,
        },
      },
    });

    if (!favorite) {
      throw new NotFoundException('Favorito não encontrado');
    }

    return this.prisma.favorite.delete({
      where: {
        userId_movieId: {
          userId,
          movieId,
        },
      },
    });
  }

  async checkFavorite(userId: number, movieId: number) {
    const favorite = await this.prisma.favorite.findUnique({
      where: {
        userId_movieId: {
          userId,
          movieId,
        },
      },
    });

    return { isFavorite: !!favorite };
  }
}
