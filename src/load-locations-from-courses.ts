import { Client } from '@googlemaps/google-maps-services-js';
import { IsNull } from 'typeorm';
import a from 'async';
import { AppConfiguration } from './configuration';
import { createDbConnection } from './db';
import { Course } from './entity/course';

const client = new Client();
const CONCURRENCY = 45;

export async function loadLocationsFromCourses() {
  const configuration = new AppConfiguration();
  const connection = await createDbConnection(configuration.databasePath);
  const courseRepo = connection.getRepository(Course);

  const courses = await courseRepo.find({
    where: {
      rawLocationData: IsNull(),
    },
  });
  if (courses.length === 0) throw new Error('No courses found');

  let counter = 1;
  // If zero, get html - https://www.pdga.com/course-directory/course/woodlands
  // Save to course model
  // Pluck off the address
  // Do the same geocoding
  // Update lat long
  // What if we don't find this?

  const q = a.queue(async (c: Course, callback) => {
    console.log(`Processing ${counter}/${courses.length}`);

    // TODO: Extract this to it's own thing
    const response = await client.geocode({
      params: {
        address: c.serializeLocation(),
        key: configuration.googleMapsApiKey,
      },
    });

    c.foundLocationCount = response.data.results.length;
    c.rawLocationData = JSON.stringify(response.data);

    await courseRepo.save(c);
    counter += 1;
    callback();
  }, CONCURRENCY);

  courses.map((c) => q.push(c));
  await q.drain();
  console.log('done!');
}
