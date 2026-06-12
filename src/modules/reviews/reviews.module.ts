import { Module } from '@nestjs/common';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';
import { GamesModule } from '../games/games.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [GamesModule, UsersModule], // <--- IMPORTANTE IMPORTAR OS DOIS
  controllers: [ReviewsController],
  providers: [ReviewsService],
})
export class ReviewsModule {}
