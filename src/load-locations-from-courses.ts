import { Client } from '@googlemaps/google-maps-services-js';
import { IsNull } from 'typeorm';
import { AppConfiguration } from './configuration';
import { createDbConnection } from './db';
import { Course } from './entity/course';

const client = new Client();
export async function loadLocationsFromCourses() {
  const configuration = new AppConfiguration();
  const connection = await createDbConnection(`${configuration.htmlDirectory}/dg.db`);
  const courseRepo = connection.getRepository(Course);
  const course = await courseRepo.findOne({
    where: {
      rawLocationData: IsNull(),
    },
  });
  if (!course) throw new Error('no courses found');

  console.log('Your course', course);

  const response = await client.geocode({
    params: {
      address: course.serializeLocation(),
      key: configuration.googleMapsApiKey,
    },
  });

  course.didFindLocations = response.data.results.length > 0;
  course.rawLocationData = JSON.stringify(response.data);

  await courseRepo.save(course);

  console.log('response', JSON.stringify(response.data, null, 2));
}
