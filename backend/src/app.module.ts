import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { MoviesModule } from './movies/movies.module';
import { FavoritesModule } from './favorites/favorites.module';
import { FavoritesService } from './favorites/favorites.service';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    MoviesModule,
    FavoritesModule,
  ],
  providers: [FavoritesService, AuthService],
  controllers: [AuthController],
})
export class AppModule { }
