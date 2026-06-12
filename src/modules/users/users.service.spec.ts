import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { NotFoundException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('deve criar um usuário com ID gerado', () => {
    const dto = { name: 'John Doe', email: 'john@example.com' };
    const user = service.create(dto);

    expect(user).toHaveProperty('id');
    expect(user.name).toBe(dto.name);
  });

  it('deve lançar NotFoundException ao buscar usuário inexistente', () => {
    expect(() => service.findOne('id-falso')).toThrow(NotFoundException);
  });
});
