import { IsNull, Not, Repository } from 'typeorm';
import { Client, GeocodeResponse } from '@googlemaps/google-maps-services-js';
import { Course } from './entity/course';
import { AppConfiguration } from './configuration';
import { getHtml } from './get-html';
import { extractAddressFromHtml } from './course-html-to-address';

interface LocationProcessorForCoursesResponse {}

class ResponseFactory {
    private courseCount = 0;

    private missingLocationData: string[] = [];

    private htmlLoaded: string[] = []

    private log: string[] = [];

    private failures: number = 0;

    private successes: number = 0;

    private skips: number = 0

    private warnings: number = 0

    coursesLoaded(courses: Course[]) {
      this.courseCount = courses.length;

      this.missingLocationData = courses.filter((course) => !course.rawLocationData).map((c) => c.id);
    }

    courseHtmlLoaded(course: Course) {
      // this.htmlLoaded.push(course.id);
      this.log.push(`Loaded html for: ${course.id}`);
    }

    getResults() {
      const {
        log, failures, successes, skips, warnings,
      } = this;
      return {
        // missingLocationData: this.missingLocationData,
        // htmlLoaded: this.htmlLoaded,
        // courseCount: this.courseCount,
        log, failures, successes, skips, warnings,

      };
    }

    noGeocodeResultsFound(course: Course) {
      this.log.push(`No geocode results found for: ${course.id}`);
      this.failures += 1;
    }

    multipleGeocodeResultsFound(course: Course) {
      this.log.push(`More than one geocode results found for ${course.id}`);
      this.warnings += 1;
    }

    courseLocationUpdated(course: Course) {
      this.log.push(`Successfully added geocode data for ${course.id}`);
      this.successes += 1;
    }

    courseAlreadyPopulated(course: Course) {
      this.log.push(`Course already has geocode coordinates, skipping: ${course.id}`);
      this.skips += 1;
    }

    coordinateOverrideExists(course: Course) {
      this.log.push(`Course override exists, using it: ${course.id}`);
      this.successes += 1;
    }

    courseExcluded(course: Course) {
      this.log.push(`Course is excluded, skipping: ${course.id}`);
      this.skips += 1;
    }
}
const client = new Client();
export class LocationProcessorForCourses {
    public state: ResponseFactory;

    private config: AppConfiguration = new AppConfiguration();

    constructor(private courseRepo: Repository<Course>) {
      this.state = new ResponseFactory();
    }

    getAllCourses() {
      return this.courseRepo.find({
        where: {
          // rawLocationData: Not(IsNull()),
          latitude: IsNull(),
        },
      });
    }

    async process() {
      const courses = await this.getAllCourses();
      this.state.coursesLoaded(courses);

      await Promise.all(courses.filter((course) => course.rawLocationData)
        .map((course) => {
          const locationData = { data: JSON.parse(course.rawLocationData!) } as GeocodeResponse;
          // return this.processCourse(course, locationData);
          return this.processNoLocations(course);
        }));
    }

    async processCourse(course: Course, locationData: GeocodeResponse) {
      // const handlers = {
      //   0: this.processNoLocations,
      // };

      const handlers = new Map<number, Function>([
        [0, this.processNoLocations],
        [1, this.processNoLocations],
      ]);

      // const handler = handlers[locationData.data.results.length];
      const handler = handlers.get(locationData.data.results.length);
      if (!handler) throw new Error('Handler exactly not found');

      await handler(course, locationData);
    }

    async processNoLocations(course: Course) {
      if (course.longitude || course.latitude) {
        this.state.courseAlreadyPopulated(course);
        return;
      }

      if (this.config.excludedCourseIds.includes(course.id)) {
        this.state.courseExcluded(course);
        return;
      }

      if (this.config.coordinateOverrides.has(course.id)) {
        const { latitude, longitude } = this.config.coordinateOverrides.get(course.id)!;
        this.state.coordinateOverrideExists(course);
        course.latitude = latitude;
        course.longitude = longitude;
        await this.courseRepo.save(course);
        return;
      }

      // Download html if it doesn't exist
      if (!course.html) {
        // We have to scrape from the individual page
        const html = await getHtml(this.config.getCourseUrl(course.id));
        course.html = html;
        await this.courseRepo.save(course);
        this.state.courseHtmlLoaded(course);
      }

      // pluck off the address to gecode
      const address = extractAddressFromHtml(course.html!);
      console.log('resp bro', address);

      // Find geocode
      const { street, locality, country } = address;
      const response = await client.geocode({
        params: {
          address: `${street} ${locality} ${country}`,
          key: this.config.googleMapsApiKey,
        },
      });
      if (response.data.results.length === 0) {
        this.state.noGeocodeResultsFound(course);
        return;
      }

      if (response.data.results.length > 1) {
        this.state.multipleGeocodeResultsFound(course);
      }

      const { lat, lng } = response.data.results[0].geometry.location;

      course.latitude = lat;
      course.longitude = lng;

      await this.courseRepo.save(course);
      this.state.courseLocationUpdated(course);
    }
}
