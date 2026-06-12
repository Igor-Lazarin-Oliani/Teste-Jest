import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GamesModule } from './modules/games/games.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [GamesModule, ReviewsModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
