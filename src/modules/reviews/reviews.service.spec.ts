import { Test, TestingModule } from '@nestjs/testing';
import { ReviewsService } from './reviews.service';
import { GamesService } from '../games/games.service';
import { UsersService } from '../users/users.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('ReviewsService', () => {
  let service: ReviewsService;
  let gamesService: GamesService;
  let usersService: UsersService;

  // 1. Criamos os objetos dublês (Mocks)
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
        // 2. Injetamos os Mocks no lugar dos serviços reais
        { provide: GamesService, useValue: mockGamesService },
        { provide: UsersService, useValue: mockUsersService },
      ],
    }).compile(); // <--- O erro acontecia aqui porque essa lista estava incompleta no seu arquivo

    service = module.get<ReviewsService>(ReviewsService);
    gamesService = module.get<GamesService>(GamesService);
    usersService = module.get<UsersService>(UsersService);

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
      mockGamesService.findOne.mockReturnValue({ id: 'game-123' });
      mockUsersService.findOne.mockReturnValue({ id: 'user-123' });

      const result = service.create(validDto);

      expect(result).toHaveProperty('id');
      expect(result.score).toBe(95);
      expect(gamesService.findOne).toHaveBeenCalledWith('game-123');
      expect(usersService.findOne).toHaveBeenCalledWith('user-123');
      expect(gamesService.updateRating).toHaveBeenCalledWith('game-123', [95]);
    });

    it('deve lançar BadRequestException se a nota for menor que 1', () => {
      const invalidDto = { ...validDto, score: 0 };
      expect(() => service.create(invalidDto)).toThrow(BadRequestException);
    });

    it('deve lançar BadRequestException se a nota for maior que 100', () => {
      const invalidDto = { ...validDto, score: 101 };
      expect(() => service.create(invalidDto)).toThrow(BadRequestException);
    });

    it('deve repassar a exceção caso o GamesService jogue um NotFoundException', () => {
      mockGamesService.findOne.mockImplementation(() => {
        throw new NotFoundException('Jogo não encontrado');
      });

      expect(() => service.create(validDto)).toThrow(NotFoundException);
    });
  });
});
