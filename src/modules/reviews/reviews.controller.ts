import { Test, TestingModule } from '@nestjs/testing';
import { ReviewsService } from './reviews.service';
import { GamesService } from '../games/games.service';
import { UsersService } from '../users/users.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('ReviewsService', () => {
  let service: ReviewsService;
  let gamesService: GamesService;
  let usersService: UsersService;

  // Criamos definições de mock para simular o comportamento dos outros serviços
  const mockGamesService = {
    findOne: jest.fn(),
    updateRating: jest.fn(),
  };

  const mockUsersService = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewsService,
        { provide: GamesService, useValue: mockGamesService },
        { provide: UsersService, useValue: mockUsersService },
      ],
    }).compile();

    service = module.get<ReviewsService>(ReviewsService);
    gamesService = module.get<GamesService>(GamesService);
    usersService = module.get<UsersService>(UsersService);

    // Limpa os mocks antes de cada teste para um teste não afetar o outro
    jest.clearAllMocks();
  });

  describe('create', () => {
    const validDto = {
      gameId: 'game-123',
      userId: 'user-123',
      content: 'Jogo sensacional!',
      score: 95,
    };

    it('deve criar uma avaliação com sucesso e chamar o recalculo de nota do jogo', () => {
      // Configuramos os mocks para fingir que acharam o jogo e o usuário
      mockGamesService.findOne.mockReturnValue({ id: 'game-123' });
      mockUsersService.findOne.mockReturnValue({ id: 'user-123' });

      const result = service.create(validDto);

      // Asserts da Review criada
      expect(result).toHaveProperty('id');
      expect(result.score).toBe(95);

      // Garante que o service validou a existência do jogo e usuário
      expect(gamesService.findOne).toHaveBeenCalledWith('game-123');
      expect(usersService.findOne).toHaveBeenCalledWith('user-123');

      // Garante que o método de recalcular nota do GamesService foi chamado
      expect(gamesService.updateRating).toHaveBeenCalledWith('game-123', [95]);
    });

    it('deve lançar BadRequestException se a nota for menor que 1', () => {
      const invalidDto = { ...validDto, score: 0 };

      expect(() => service.create(invalidDto)).toThrow(
        new BadRequestException('A nota deve ser entre 1 e 100'),
      );

      // O fluxo deve morrer antes de tocar nos outros serviços
      expect(gamesService.findOne).not.toHaveBeenCalled();
    });

    it('deve lançar BadRequestException se a nota for maior que 100', () => {
      const invalidDto = { ...validDto, score: 101 };

      expect(() => service.create(invalidDto)).toThrow(BadRequestException);
    });

    it('deve repassar a exceção caso o GamesService jogue um NotFoundException', () => {
      // Simula o erro de jogo não encontrado
      mockGamesService.findOne.mockImplementation(() => {
        throw new NotFoundException('Jogo não encontrado');
      });

      expect(() => service.create(validDto)).toThrow(NotFoundException);

      // Como o jogo falhou, nem deve tentar procurar o usuário
      expect(usersService.findOne).not.toHaveBeenCalled();
    });
  });
});
