import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { CreateFavoriteDto } from './dto/add.dto';

@Controller('favorites')
export class FavoritesController {
  constructor(private favoritesService: FavoritesService) {}

  @Post(':userId')
  async addFavorite(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() data: CreateFavoriteDto,
  ) {
    return this.favoritesService.addFavorite(userId, data);
  }

  @Get(':userId')
  async getFavorites(@Param('userId', ParseIntPipe) userId: number) {
    return this.favoritesService.getFavorites(userId);
  }

  @Delete(':userId/:movieId')
  async removeFavorite(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('movieId', ParseIntPipe) movieId: number,
  ) {
    return this.favoritesService.removeFavorite(userId, movieId);
  }

  @Get(':userId/check/:movieId')
  async checkFavorite(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('movieId', ParseIntPipe) movieId: number,
  ) {
    return this.favoritesService.checkFavorite(userId, movieId);
  }
}
