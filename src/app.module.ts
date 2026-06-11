import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GamesModule } from './src/modules/games/games.module';
import { GamesModule } from './games/games.module';
import { Module } from './games/modules/.module';
import { GamesModule } from './modules/games/games.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [GamesModule, Module, ReviewsModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
