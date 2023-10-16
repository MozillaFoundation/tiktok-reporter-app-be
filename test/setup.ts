import { TestApp } from './test-app';
import { getDataSourceToken } from '@nestjs/typeorm';

global.beforeEach(async () => {
  try {
    const app = await TestApp.getInstance().getApp();
    console.log('I am here');
    const token = getDataSourceToken();
    const connection = app.get(token);

    console.log('Dropping:');
    await connection.dropDatabase();
    console.log('Dropped');
  } catch (err) {
    console.log('Error while removing db but its ok: ', JSON.stringify(err));
  }
});

global.afterAll(async () => {
  console.log('Closing');
  const app = await TestApp.getInstance().getApp();

  await app.close();
  console.log('Closed');
});
