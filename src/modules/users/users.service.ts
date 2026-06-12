import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  private users: User[] = [];

  create(createUserDto: CreateUserDto): User {
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      ...createUserDto,
    };
    this.users.push(newUser);
    return newUser;
  }

  findOne(id: string): User {
    const user = this.users.find((u) => u.id === id);
    if (!user) throw new NotFoundException('Usuário não encontrado');
    return user;
  }
}
