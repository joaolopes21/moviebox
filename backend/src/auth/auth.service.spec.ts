import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { HttpException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('deve criar um novo usuário com senha hasheada', async () => {
      const registerDto = {
        name: 'João Silva',
        email: 'joao@example.com',
        password: 'senha123',
      };

      const hashedPassword = await bcrypt.hash('senha123', 10);
      const mockUser = {
        id: 1,
        name: 'João Silva',
        email: 'joao@example.com',
        password: hashedPassword,
        createdAt: new Date(),
      };

      mockPrismaService.user.findUnique.mockResolvedValue(null);
      mockPrismaService.user.create.mockResolvedValue(mockUser);

      const result = await service.register(registerDto);

      expect(result).toHaveProperty('user');
      expect(result.user.email).toBe('joao@example.com');
      expect(mockPrismaService.user.create).toHaveBeenCalled();
    });

    it('deve lançar erro se email já existe', async () => {
      const registerDto = {
        name: 'João Silva',
        email: 'joao@example.com',
        password: 'senha123',
      };

      mockPrismaService.user.findUnique.mockResolvedValue({
        id: 1,
        email: 'joao@example.com',
      });

      await expect(service.register(registerDto)).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('login', () => {
    it('deve retornar usuário se credenciais estiverem corretas', async () => {
      const loginDto = {
        email: 'joao@example.com',
        password: 'senha123',
      };

      const hashedPassword = await bcrypt.hash('senha123', 10);
      const mockUser = {
        id: 1,
        name: 'João Silva',
        email: 'joao@example.com',
        password: hashedPassword,
        createdAt: new Date(),
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.login(loginDto);

      expect(result).toHaveProperty('user');
      expect(result.user.email).toBe('joao@example.com');
    });

    it('deve lançar erro se usuário não existe', async () => {
      const loginDto = {
        email: 'naoexiste@example.com',
        password: 'senha123',
      };

      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(HttpException);
    });

    it('deve lançar erro se senha está incorreta', async () => {
      const loginDto = {
        email: 'joao@example.com',
        password: 'senhaerrada',
      };

      const hashedPassword = await bcrypt.hash('senha123', 10);
      const mockUser = {
        id: 1,
        email: 'joao@example.com',
        password: hashedPassword,
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      await expect(service.login(loginDto)).rejects.toThrow(HttpException);
    });
  });
});
