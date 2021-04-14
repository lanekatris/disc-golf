import { Connection } from 'typeorm';
import { AppConfiguration } from './configuration/configuration';
import { CoursesByState, STATES } from './courses-by-state';
import { createDbConnection } from './db';

export async function getCoursesByStateAndPersist(state: STATES, connection: Connection) {
  const appConfiguration = new AppConfiguration();
  const query = new CoursesByState(state, appConfiguration, connection);
  const result = await query.getCourses({
    cacheFolder: appConfiguration.htmlDirectory,
  });

  console.log('found these result', {
    count: result.length,
    state,
    // course: result[0],
  });

  // Now we need to persist our well defined dg courses
  // const connection = await createDbConnection(`${appConfiguration.htmlDirectory}/dg.db`);
  try {
    await connection.manager.save(result);
  } catch (e) {
    console.error(e);
    throw e;
  }

  // Alter any columns or data and then create a csv or json file?
  // Need a way to download for all states
}

export async function createDataset(configuration: AppConfiguration) {
  const states = Object.values(STATES);

  const connection = await createDbConnection(`${configuration.htmlDirectory}/dg.db`);

  for (const state of states) {
    await getCoursesByStateAndPersist(state, connection);
  }

  // Create a csv file for kaggle, either by their api or just create CSV

  // Deal with cache's like where all th ehtml goes
  return `hey there: ${configuration.htmlDirectory}`;
}

// https://www.pdga.com/course-directory/advanced?title=&field_course_location_country=US&field_course_location_locality=&field_course_location_administrative_area=DC&field_course_location_postal_code=&field_course_type_value=All&rating_value=All&field_course_holes_value=All&field_course_total_length_value=All&field_course_target_type_value=All&field_course_tee_type_value=All&field_location_type_value=All&field_course_camping_value=All&field_course_facilities_value=All&field_course_fees_value=All&field_course_handicap_value=All&field_course_private_value=All&field_course_signage_value=All&field_cart_friendly_value=All

// Remove beginning of id in the database
// clean up zip code
// clean up id
// play with packaging up the html indexes
