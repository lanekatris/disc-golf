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
      const handlers = {
        0: this.processNoLocations,
      };

      const handler = handlers[locationData.data.results.length];

      await handler(course, locationData);
    }

    async processNoLocations(course: Course, locationData: GeocodeResponse) {

    }
}
