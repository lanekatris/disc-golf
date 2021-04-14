import { Connection } from 'typeorm';
import { AppConfiguration } from './configuration';
import { CoursesByState } from './courses-by-state';
import { createDbConnection } from './db';
import { STATE } from './state';
import { Html } from './entity/html';

export async function getCoursesByStateAndPersist(state: STATE, connection: Connection) {
  const appConfiguration = new AppConfiguration();
  const query = new CoursesByState({
    state, configuration: appConfiguration, htmlRepo: connection.getRepository(Html),
  });
  const result = await query.getCourses();

  console.log('found these result', {
    count: result.length,
    state,
  });

  try {
    await connection.manager.save(result);
  } catch (e) {
    console.error(e);
    throw e;
  }
}

export async function loadCoursesIntoDb(configuration: AppConfiguration) {
  const states = Object.values(STATE);

  const connection = await createDbConnection(`${configuration.htmlDirectory}/dg.db`);

  // eslint-disable-next-line no-restricted-syntax
  for (const state of states) {
    // eslint-disable-next-line no-await-in-loop
    await getCoursesByStateAndPersist(state, connection);
  }
}
