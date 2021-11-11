const mongoose = require('mongoose');
const supertest = require('supertest');
const { initializeServer, app } = require('..');
const { connectDB } = require('../../database');
const Serie = require('../../database/models/serie');

const request = supertest(app);
let server;
let newSerie1;
let newSerie2;

beforeAll(async () => {
  await connectDB(process.env.MONGODB_STRING);
  server = await initializeServer(6666);
  await Serie.deleteMany();
});

afterAll((done) => {
  server.close(async () => {
    await mongoose.connection.close();
    done();
  });
});

beforeEach(async () => {
  newSerie1 = await Serie.create({
    name: 'Breaking Bad',
    isWatched: true,
    platformId: '618c2bde9712904c2b990e99',
  });
  newSerie2 = await Serie.create({
    name: 'Breaking Good',
    isWatched: true,
    platformId: '618c2bde9712904c2b990e96',
  });
});

afterEach(async () => {
  await Serie.deleteMany();
});

describe('Given a /series route', () => {
  describe('When it receives a get request', () => {
    test('Then it should response with a list of series', async () => {
      const response = await request.get('/series/').expect(200);

      expect(response.body[0]).toHaveProperty('name', newSerie1.name);
      expect(response.body[1]).toHaveProperty('name', newSerie2.name);
    });
  });
  // describe('When it receives a wrong get request', () => {
  //   test('Then it should response with an error', async () => {
  //     jest.mock('../../database/models/serie');
  //     Serie.find = jest.fn().mockRejectedValue(new Error());
  //     const response = await request.get('/series/').expect(400);
  //   });
  // });
});
