import { parseAsync } from 'json2csv';
import { Repository } from 'typeorm';
import fs from 'fs-extra';
import { Course } from './entity/course';
import { AppConfiguration } from './configuration';

interface CreateCsvInput {
  courseRepo: Repository<Course>;
  configuration: AppConfiguration
}

export async function createCsvFromCoursesDb(input: CreateCsvInput) {
  const { courseRepo, configuration: { csvPath } } = input;

  console.log('Querying database for all courses...');
  const courses = await courseRepo.find();
  if (courses.length === 0) {
    console.warn('No courses found, not creating CSV. Did you run \'load-courses-into-db\'?');
    return;
  }
  console.log(`Found ${courses.length} courses`);

  console.log('Creating CSV file...');

  const csv = await parseAsync(courses, {
    fields: ['id', 'name', 'city', 'state', 'zip', 'holeCount', 'rating', 'latitude', 'longitude'],
  });

  console.log('Writing CSV file...');
  await fs.outputFile(csvPath, csv);
  console.log('Done');
}
