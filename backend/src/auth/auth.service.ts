import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';


@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService) { }
    async register(registerDto: RegisterDto) {
        const { email, password, name } = registerDto;
        const existingUser = await this.prisma.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            throw new ConflictException('Email já cadastrado');
        }
        const hashedPassword = await bcrypt.hash(password, 5);
        const user = await this.prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
            },
        });
        return {
            message: 'Cadastro realizado com sucesso',
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
            },
        };
    }
    async login(loginDto: LoginDto) {
        const { email, password } = loginDto;
        const user = await this.prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            throw new UnauthorizedException('Email ou senha inválidos');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Email ou senha inválidos');
        }
        return {
            message: 'Login realizado com sucesso',
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
            },
        };
    }
    async getProfile(userId: number) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                name: true,
            },
        });
        if (!user) {
            throw new UnauthorizedException('Usuário não encontrado');
        }
        return user;
    }
}