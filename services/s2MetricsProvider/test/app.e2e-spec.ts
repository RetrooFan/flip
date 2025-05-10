import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { HelloModule } from '../../../shared/src/modules/hello/hello.module';
import { ConfigModule, ConfigObject } from '@nestjs/config';

describe('HelloModule (e2e)', () => {
  let app: INestApplication;
  let api: request.SuperTest<request.Test>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [
            (): ConfigObject => {
              return {
                packageName: process.env.npm_package_name,
              };
            },
          ],
        }),
        HelloModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    api = request(app.getHttpServer());
  });

  it('/ (GET)', () => {
    return api.get('/hello').expect(200).expect(`Hello! It's flip-recruitment-task!`);
  });
});
