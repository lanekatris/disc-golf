import { IsNull, Not, Repository } from 'typeorm';
import { GeocodeResponse } from '@googlemaps/google-maps-services-js';
import { AppConfiguration } from './configuration';
import { createDbConnection } from './db';
import { Course } from './entity/course';

export async function evaluateGeocodes(courseRepo: Repository<Course>) {
  const courses = await courseRepo.find({
    where: {
      rawLocationData: Not(IsNull()),
      latitude: IsNull(),
    },
  });
  if (courses.length === 0) throw new Error('No courses found');

  let counter = 1;

  // eslint-disable-next-line no-restricted-syntax
  for (const course of courses) {
    console.log(`Processing ${counter}/${courses.length}`);
    if (!course.rawLocationData) throw new Error('raw location data is null');

    course.foundLocationCount = originalResult.data.results.length;

    if (originalResult.data.results.length > 1 || originalResult.data.results.length === 0) {
      console.log(`skipping course because an issue with result count: ${originalResult.data.results.length}`);
    } else {
      console.log(originalResult);
      const { location } = originalResult.data.results[0].geometry;

      course.latitude = location.lat;
      course.longitude = location.lng;
    }

    // eslint-disable-next-line no-await-in-loop
    await courseRepo.save(course);
    counter += 1;
  }
}
