import { Injectable, BadRequestException } from '@nestjs/common';
import { Review } from './entities/review.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { GamesService } from '../games/games.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class ReviewsService {
  private reviews: Review[] = [];

  // Injetamos os outros serviços para fazer as validações de negócio
  constructor(
    private readonly gamesService: GamesService,
    private readonly usersService: UsersService,
  ) {}

  create(createReviewDto: CreateReviewDto): Review {
    // Validação de Regra de Negócio: A nota deve ser entre 1 e 100
    if (createReviewDto.score < 1 || createReviewDto.score > 100) {
      throw new BadRequestException('A nota deve ser entre 1 e 100');
    }

    // Garante que o jogo e o usuário existem (lança erro 404 interno se não existirem)
    this.gamesService.findOne(createReviewDto.gameId);
    this.usersService.findOne(createReviewDto.userId);

    const newReview: Review = {
      id: Math.random().toString(36).substr(2, 9),
      ...createReviewDto,
    };

    this.reviews.push(newReview);

    // Recalcula a nota do jogo com base em todas as reviews existentes para ele
    const allGameScores = this.reviews
      .filter((r) => r.gameId === createReviewDto.gameId)
      .map((r) => r.score);

    this.gamesService.updateRating(createReviewDto.gameId, allGameScores);

    return newReview;
  }

  findByGame(gameId: string): Review[] {
    return this.reviews.filter((r) => r.gameId === gameId);
  }
}
