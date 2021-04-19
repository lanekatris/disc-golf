import { IsNull, Not, Repository } from 'typeorm';
import { GeocodeResponse } from '@googlemaps/google-maps-services-js';
import { Course } from './entity/course';

export async function processLocationForCourses(courseRepo: Repository<Course>) {

}

interface LocationProcessorForCoursesResponse {}

class ResponseFactory {
    private courseCount = 0;

    private missingLocationData: string[] = [];

    coursesLoaded(courses: Course[]) {
      this.courseCount = courses.length;

      this.missingLocationData = courses.filter((course) => !course.rawLocationData).map((c) => c.id);
    }
}

export class LocationProcessorForCourses {
    private state: ResponseFactory;

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
          return this.processCourse(course, locationData);
        }));
    }

    async processCourse(course: Course, locationData: GeocodeResponse) {
      // const handlers = {
      //   0: this.processNoLocations,
      // };

      const handlers = new Map<number, Function>([
        [0, this.processNoLocations],
        [1, this.processOneLocation],
      ]);

      // const handler = handlers[locationData.data.results.length];
      const handler = handlers.get(locationData.data.results.length);
      if (!handler) throw new Error('Handler exactly not found');

      await handler(course, locationData);
    }

    async processNoLocations(course: Course, locationData: GeocodeResponse) {
      // We have to scrape and
    }

    async processOneLocation(course: Course, locationData: GeocodeResponse) {

    }
}
