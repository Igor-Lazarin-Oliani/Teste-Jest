import { Test, TestingModule } from '@nestjs/testing';
import { GamesService } from './games.service';
import { NotFoundException } from '@nestjs/common';

describe('GamesService', () => {
  let service: GamesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GamesService],
    }).compile();

    service = module.get<GamesService>(GamesService);
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('deve criar um jogo com rating inicial zero e lista de reviews vazia', () => {
      const dto = { title: 'The Witcher 3', genre: 'RPG' };
      const result = service.create(dto);

      expect(result).toHaveProperty('id');
      expect(result.title).toBe(dto.title);
      expect(result.rating).toBe(0);
      expect(result.reviewIds).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('deve retornar um jogo se o ID existir', () => {
      const game = service.create({ title: 'Elden Ring', genre: 'Souls' });
      const found = service.findOne(game.id);

      expect(found).toEqual(game);
    });

    it('deve lançar NotFoundException se o jogo não existir', () => {
      expect(() => service.findOne('id-inexistente')).toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateRating', () => {
    it('deve calcular a média das notas corretamente com arredondamento', () => {
      const game = service.create({ title: 'Cyberpunk 2077', genre: 'RPG' });

      // Notas: 80, 90, 75 -> Média: 81.6666... -> Deve arredondar para 81.7
      const updatedGame = service.updateRating(game.id, [80, 90, 75]);

      expect(updatedGame.rating).toBe(81.7);
    });

    it('deve definir rating como 0 se a lista de notas for vazia', () => {
      const game = service.create({ title: 'Game sem notas', genre: 'Indie' });
      const updatedGame = service.updateRating(game.id, []);

      expect(updatedGame.rating).toBe(0);
    });
  });
});
