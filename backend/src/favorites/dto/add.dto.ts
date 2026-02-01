import { IsInt, IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateFavoriteDto {
  @IsInt()
  movieId: number;

  @IsString()
  movieTitle: string;

  @IsOptional()
  @IsString()
  moviePoster?: string;

  @IsOptional()
  @IsNumber()
  movieRating?: number;

  @IsOptional()
  @IsString()
  movieYear?: string;
}
