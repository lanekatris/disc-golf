import { AppConfiguration } from '../src/configuration';
import { loadCoursesIntoDb } from '../src/load-courses-into-db';
import { createCsvFromCoursesDb } from '../src/create-csv-from-courses-db';
import { createDbConnection } from '../src/db';
import { Course } from '../v2/entity/course';
import { loadLocationsFromCourses } from '../src/load-locations-from-courses';
import { evaluateGeocodes } from '../src/evaluate-geocodes';
import { LocationProcessorForCourses } from '../src/process-location-for-courses';

describe('Create Dataset', function describeAll() {
  this.timeout(200000);
  it('Load all US courses to sql', async () => {
    await loadCoursesIntoDb(new AppConfiguration());
  });

  // it('Creates csv file', async () => {
  //   const configuration = new AppConfiguration();
  //   const connection = await createDbConnection(configuration.databasePath);
  //   await createCsvFromCoursesDb({
  //     configuration,
  //     courseRepo: connection.getRepository(Course),
  //   });
  // });
  // it('Finds GPS coordinates for courses', async () => {
  //   await loadLocationsFromCourses();
  // });
  // it('Evaluates geocode result and updates db', async () => {
  //   // await evaluateGeocodes();
  // });
  // it('Create database', async () => {
  //   await createDbConnection();
  // });
  //
  // it('Set html for course with no initial geocode results', async () => {
  //   const configuration = new AppConfiguration();
  //   const connection = await createDbConnection(configuration.databasePath);
  //   const repo = connection.getRepository(Course);
  //   const processor = new LocationProcessorForCourses(repo);
  //
  //   const course = await repo.findOne({ id: 'woodlands' });
  //   if (!course) throw new Error('course not found woodlands');
  //   // await processor.processNoLocations(course);
  //   await processor.process();
  //   console.log(processor.state.getResults());
  // });
});
