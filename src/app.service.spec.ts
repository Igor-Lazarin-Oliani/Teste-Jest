import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';

describe('AppService', () => {
  let service: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppService],
    }).compile();

    service = module.get<AppService>(AppService);
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('getHello', () => {
    it('deve retornar "Hello World!"', () => {
      // Se você alterou o retorno do seu app.service.ts, mude o texto abaixo correspondente
      expect(service.getHello()).toBe('Hello World!');
    });
  });
});
