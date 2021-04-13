// import { expect } from 'chai';
import 'reflect-metadata';

import { CoursesByState, STATES } from '../src/courses-by-state';
import { AppConfiguration } from '../src/configuration/configuration';

describe('Create Dataset', function () {
  this.timeout(20000);
  it('For Kaggle', async () => {
    const appConfiguration = new AppConfiguration();
    const query = new CoursesByState(STATES.WestVirginia);
    const result = await query.getCourses({
      cacheFolder: appConfiguration.htmlDirectory,
    });

    console.log('found these result', {
      count: result.length,
      course: result[0],
    });

    // Now we need to persist our well defined dg courses
  });
});
