import { ConfigModule, ConfigObject, ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { HelloService } from './hello.service';

describe('HelloService', () => {
  let helloService: HelloService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [
            (): ConfigObject => ({
              packageName: 'packageName',
            }),
          ],
        }),
      ],
      providers: [HelloService, ConfigService],
    }).compile();

    helloService = app.get<HelloService>(HelloService);
  });

  it('should be defined', () => {
    expect(helloService).toBeDefined();
  });

  describe('getHello', () => {
    it('should return proper message', () => {
      expect(helloService.getHello()).toBe(`Hello! It's packageName!`);
    });
  });
});
