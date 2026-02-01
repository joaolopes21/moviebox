import { IsEmail, IsString, IsNotEmpty } from 'class-validator';

export class LoginDto {
    @IsEmail({}, { message: 'Email inválido' })
    @IsNotEmpty({ message: 'Email é obrigatório' })

    email: string;
    @IsString({ message: 'Senha deve ser texto' })
    @IsNotEmpty({ message: 'Senha é obrigatória' })
    password: string;
}
