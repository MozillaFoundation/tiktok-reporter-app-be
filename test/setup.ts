import { join } from 'path';
import { rm } from 'fs';

global.beforeEach(async () => {
  try {
    const fileName = join(__dirname, '..', 'db.test.sqlite');
    console.log(`Removing old DB file for testing ${fileName}`);

    await rm(fileName, () => {
      console.log('No params callback');
    });
  } catch (err) {
    console.log('Error while removing db but its ok');
  }
});
