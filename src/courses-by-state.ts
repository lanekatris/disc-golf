import { downloadOrRead } from './file';
import { Course } from './course';

const path = require('path');
const cheerio = require('cheerio');

export interface GetCoursesOptions {
  cacheFolder: string;
}

interface ExtractCoursesResponse {
  courses: Course[];
  hasMore: boolean;
}

export enum STATES {
  Alabama = 'AL',
  Alaska = 'AK',
  Arizona = 'AZ',
  Arkansas = 'AR',
  California = 'CA',
  Colorado = 'CO',
  Connecticut = 'CT',
  Delaware = 'DE',
  DistrictofColumbia = 'DC',
  Florida = 'FL',
  Georgia = 'GA',
  Hawaii = 'HI',
  Idaho = 'ID',
  Illinois = 'IL',
  Indiana = 'IN',
  Iowa = 'IA',
  Kansas = 'KS',
  Kentucky = 'KY',
  Louisiana = 'LA',
  Maine = 'ME',
  Maryland = 'MD',
  Massachusetts = 'MA',
  Michigan = 'MI',
  Minnesota = 'MN',
  Mississippi = 'MS',
  Missouri = 'MO',
  Montana = 'MT',
  Nebraska = 'NE',
  Nevada = 'NV',
  NewHampshire = 'NH',
  NewJersey = 'NJ',
  NewMexico = 'NM',
  NewYork = 'NY',
  NorthCarolina = 'NC',
  NorthDakota = 'ND',
  Ohio = 'OH',
  Oklahoma = 'OK',
  Oregon = 'OR',
  Pennsylvania = 'PA',
  RhodeIsland = 'RI',
  SouthCarolina = 'SC',
  SouthDakota = 'SD',
  Tennessee = 'TN',
  Texas = 'TX',
  Utah = 'UT',
  Vermont = 'VT',
  Virginia = 'VA',
  Washington = 'WA',
  WestVirginia = 'WV',
  Wisconsin = 'WI',
  Wyoming = 'WY',
  AA = 'AA',
  AE = 'AE',
  AP = 'AP',
  AS = 'AS',
  FM = 'FM',
  Guam = 'GU',
  MarshallIslands = 'MH',
  NorthernMarianaIslands = 'MP',
  Palau = 'PW',
  PuertoRico = 'PR',
  VirginIslands = 'VI'
}

export class CoursesByState {
  private page: number = 0;

  constructor(public state: STATES = STATES.Colorado) {}

  private getUrl(): string {
    const pageQuery = this.page === 0 ? '' : `&page=${this.page}`;
    return `https://www.pdga.com/course-directory/advanced?title=&field_course_location_country=US&field_course_location_locality=&field_course_location_administrative_area=${this.state}&field_course_location_postal_code=&field_course_type_value=All&rating_value=All&field_course_holes_value=All&field_course_total_length_value=All&field_course_target_type_value=All&field_course_tee_type_value=All&field_location_type_value=All&field_course_camping_value=All&field_course_facilities_value=All&field_course_fees_value=All&field_course_handicap_value=All&field_course_private_value=All&field_course_signage_value=All&field_cart_friendly_value=All${pageQuery}`;
  }

  private static clean(
    input: string,
    type: string = 'string',
  ): string | number {
    const result = input.replace(/\n/, '');

    if (type === 'num') return parseInt(result, 10);

    return result;
  }

  private extractCoursesFromHtml(html: string): ExtractCoursesResponse {
    const $ = cheerio.load(html);
    const rows = $('tbody tr');

    const courses: Course[] = [];

    rows.each((index: number, element: any) => {
      const el = $(element);
      const id = el.find('.views-field-title a').attr('href') as string;

      courses.push(
        new Course(
          id,
          el.find('.views-field-title a').text(),
          el
            .find('.views-field-field-course-location')
            .text()
            .replace(/\n/, ''),
          el.find('.addressfield-state').text(),
          CoursesByState.clean(
            el.find('.views-field-field-course-location-1', 'num').text(),
            'num',
          ) as number,
          CoursesByState.clean(
            el.find('.views-field-field-course-holes').text(),
            'num',
          ) as number,
          CoursesByState.clean(
            el
              .find('.average-rating')
              .text()
              .replace(/Average: /, ''),
            'num',
          ) as number,
        ),
      );
    });
    // console.log(courses[0].serializeLocation());

    return {
      courses,
      hasMore: $('.pager-last.last').length > 0,
    };
  }

  private async downloadAndParseCourses(
    options: GetCoursesOptions,
  ): Promise<ExtractCoursesResponse> {
    const url = this.getUrl();
    const response = await downloadOrRead(
      url,
      path.join(
        options.cacheFolder,
        `dg-courses-by-state-${this.state}-page-${this.page}.html`,
      ),
    );
    this.page++;

    return this.extractCoursesFromHtml(response);
  }

  public async getCourses(options: GetCoursesOptions): Promise<Course[]> {
    let courses: Course[] = [];

    let loadMore = true;
    while (loadMore) {
      console.log(`Getting courses for page: ${this.page}`);
      const response = await this.downloadAndParseCourses(options);
      console.log(`Found ${response.courses.length}`);
      courses = courses.concat(response.courses);
      loadMore = response.hasMore;
    }

    return courses;
  }
}
