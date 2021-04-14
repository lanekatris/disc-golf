import { AppConfiguration } from '../src/configuration';
import { loadCoursesIntoDb } from '../src/load-courses-into-db';

describe('Create Dataset', function describeAll() {
  this.timeout(200000);
  it('Load all US courses to sql', async () => {
    await loadCoursesIntoDb(new AppConfiguration());
  });
});
