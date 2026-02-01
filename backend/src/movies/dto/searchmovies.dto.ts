import { IsString, IsNotEmpty, Min } from 'class-validator';
export class SearchMoviesDto {

    @IsString()
    @IsNotEmpty()
    @Min(1)
    query: string;
    page?: number = 1;

}