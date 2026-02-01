import { IsEmail, IsString, MinLength, IsNotEmpty } from 'class-validator';

export class RegisterDto {
    @IsEmail({}, { message: 'Email inválido' })
    @IsNotEmpty({ message: 'Email não pode ser nulo' })
    email: string;
    @IsString({ message: 'Senha deve ser texto' })
    @MinLength(6, { message: 'A senha deve possuir no mínimo 6 caracteres' })
    @IsNotEmpty({ message: 'A senha não pode ser nula' })
    password: string;
    @IsString({ message: 'Nome deve ser texto' })
    @IsNotEmpty({ message: 'O nome não pode ser vazio' })
    name: string;
}
