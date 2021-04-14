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
  const connection = await createDbConnection(`${configuration.htmlDirectory}/dg.db`);
  const courseRepo = connection.getRepository(Course);

  // const course = await courseRepo.findOne({
  //   where: {
  //     rawLocationData: IsNull(),
  //   },
  // });
  const courses = await courseRepo.find({
    where: {
      rawLocationData: IsNull(),
    },
  });

  if (courses.length === 0) throw new Error('No courses found');

  let counter = 1;
  const q = a.queue(async (c: Course, callback) => {
    console.log(`Processing ${counter}/${courses.length}`);
    const response = await client.geocode({
      params: {
        address: c.serializeLocation(),
        key: configuration.googleMapsApiKey,
      },
    });

    c.didFindLocations = response.data.results.length > 0;
    c.rawLocationData = JSON.stringify(response.data);

    await courseRepo.save(c);
    counter++;
    callback();
  // }, 45);
  }, CONCURRENCY);

  // q.drain(async () => {
  //   // We are done
  // });

  courses.map((c) => q.push(c));
  await q.drain();
  // await q.push(courses);
  console.log('done!');

  // console.log('response', JSON.stringify(response.data, null, 2));
}
