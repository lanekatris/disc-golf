import { AppConfiguration } from '../src/configuration';
import { loadCoursesIntoDb } from '../src/load-courses-into-db';
import { createCsvFromCoursesDb } from '../src/create-csv-from-courses-db';
import { createDbConnection } from '../src/db';
import { Course } from '../src/entity/course';
import { loadLocationsFromCourses } from '../src/load-locations-from-courses';
import { evaluateGeocodes } from '../src/evaluate-geocodes';

describe('Create Dataset', function describeAll() {
  this.timeout(200000);
  it('Load all US courses to sql', async () => {
    await loadCoursesIntoDb(new AppConfiguration());
  });
  it('Creates csv file', async () => {
    const configuration = new AppConfiguration();
    const connection = await createDbConnection(configuration.databasePath);
    await createCsvFromCoursesDb({
      configuration,
      courseRepo: connection.getRepository(Course),
    });
  });
  it('Finds GPS coordinates for courses', async () => {
    await loadLocationsFromCourses();
  });
  it('Evaluates geocode result and updates db', async () => {
    await evaluateGeocodes();
  });
  it('Create database', async () => {
    await createDbConnection()
  })
});
