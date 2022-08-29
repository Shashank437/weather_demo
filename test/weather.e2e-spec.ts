import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('WeatherController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  //below code lines are stricted only to test databse
  //   it('it should create a new city', () => {
  //     return request(app.getHttpServer())
  //       .post('/city')
  //       .send({
  //         name: 'Gangtok',
  //       })
  //       .expect(201);
  //   });

  //   it('it should return an error for creating a duplicate city', () => {
  //     return request(app.getHttpServer())
  //       .post('/city')
  //       .send({
  //         name: 'Mumbai',
  //       })
  //       .expect(409);
  //   });

  it('it should return city for an id', () => {
    const id = 1;
    return request(app.getHttpServer()).get(`/city/${id}`).expect(200);
  });
});
