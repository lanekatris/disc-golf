import { AppConfiguration } from '../src/configuration/configuration';
import { createDataset } from '../src/create-dataset';

describe('Create Dataset', function describeAll() {
  this.timeout(200000);
  it('Load all US courses to sql', async () => {
    await createDataset(new AppConfiguration());
  });
});
