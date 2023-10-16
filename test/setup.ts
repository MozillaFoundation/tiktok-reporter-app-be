import { RegretsReporterTestSetup } from './regretsReporterTestSetup';
import { getDataSourceToken } from '@nestjs/typeorm';

global.beforeEach(async () => {
  try {
    const app = await RegretsReporterTestSetup.getInstance().getApp();

    const token = getDataSourceToken();
    const connection = app.get(token);

    await connection.dropDatabase();
    await app.close();
  } catch (err) {
    console.log('Error while removing db: ', JSON.stringify(err));
  }
});

global.afterAll(async () => {
  const app = await RegretsReporterTestSetup.getInstance().getApp();

  await app.close();
});
