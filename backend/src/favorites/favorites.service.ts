import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddFavoriteDto } from './dto/add.dto';

@Injectable()
export class FavoritesService {
    constructor(private prisma: PrismaService) { }
    async addFavorite(userId: number, addFavoriteDto: AddFavoriteDto) {
        const { movieId, movieTitle, moviePoster, movieRating, movieYear } = addFavoriteDto;
        const existing = await this.prisma.favorite.findUnique({
            where: {
                userId_movieId: {
                    userId,
                    movieId,
                },
            },
        });
        if (existing) {
            throw new ConflictException('Filme já está nos favoritos');
        }
        const favorite = await this.prisma.favorite.create({
            data: {
                userId,
                movieId,
                movieTitle,
                moviePoster,
                movieRating,
                movieYear,
            },
        });
        return favorite;
    }
    async getFavorites(userId: number) {
        return this.prisma.favorite.findMany({
            where: { userId },
        });
    }
    async isFavorite(userId: number, movieId: number) {
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
        await this.prisma.favorite.delete({
            where: {
                id: favorite.id,
            },
        });
        return { message: 'Favorito removido com sucesso' };
    }
}