// import { expect } from 'chai';

import { CoursesByState, STATES } from '../src/courses-by-state';
import { AppConfiguration } from '../src/configuration/configuration';
import { createDbConnection } from '../src/db';
import { createDataset, getCoursesByStateAndPersist } from '../src/create-dataset';

describe('Create Dataset', function () {
  this.timeout(200000);
  it('For Kaggle', async () => {
    const appConfiguration = new AppConfiguration();
    // const query = new CoursesByState(STATES.Colorado);
    // const result = await query.getCourses({
    //   cacheFolder: appConfiguration.htmlDirectory,
    // });
    //
    // console.log('found these result', {
    //   count: result.length,
    //   course: result[0],
    // });
    //
    // // Now we need to persist our well defined dg courses
    // const connection = await createDbConnection(`${appConfiguration.htmlDirectory}/dg.db`);
    // await connection.manager.save(result);

    // Alter any columns or data and then create a csv or json file?
    // Need a way to download for all states

    // const connection = await createDbConnection(`${appConfiguration.htmlDirectory}/dg.db`);
    // await getCoursesByStateAndPersist(STATES.Texas, connection);
    await createDataset(new AppConfiguration());
  });
  it('give me keys', () => {
    console.log(Object.values(STATES));
  });
});
