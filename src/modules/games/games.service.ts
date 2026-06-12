import { Injectable, NotFoundException } from '@nestjs/common';
import { Game } from './entities/game.entity';
import { CreateGameDto } from './dto/create-game.dto';

@Injectable()
export class GamesService {
  private games: Game[] = [];

  create(createGameDto: CreateGameDto): Game {
    const newGame: Game = {
      id: Math.random().toString(36).substr(2, 9),
      title: createGameDto.title,
      genre: createGameDto.genre,
      rating: 0,
      reviewIds: [],
    };
    this.games.push(newGame);
    return newGame;
  }

  findAll(): Game[] {
    return this.games;
  }

  findOne(id: string): Game {
    const game = this.games.find((g) => g.id === id);
    if (!game) throw new NotFoundException('Jogo não encontrado');
    return game;
  }

  // Método essencial para atualizar a nota do jogo (Lógica Crítica para Testar!)
  updateRating(gameId: string, ratings: number[]): Game {
    const game = this.findOne(gameId);

    if (ratings.length === 0) {
      game.rating = 0;
    } else {
      const sum = ratings.reduce((acc, curr) => acc + curr, 0);
      // Salva a média arredondada com uma casa decimal
      game.rating = Math.round((sum / ratings.length) * 10) / 10;
    }

    return game;
  }
}
