import cheerio from 'cheerio';
import { Course } from './entity/course';

export interface ExtractCoursesResponse {
    courses: Course[];
    hasMore: boolean;
}

function clean(
  input: string,
  type: string = 'string',
): string | number {
  const result = input.replace(/\n/, '');

  if (type === 'num') return parseInt(result, 10);

  return result;
}

const replacements = new Map().set('!8603', '18603');

export function extractCoursesFromHtml(html: string): ExtractCoursesResponse {
  const $ = cheerio.load(html);
  const rows = $('tbody tr');

  const courses: Course[] = [];

  rows.each((index: number, element: any) => {
    const el = $(element);
    const id = el.find('.views-field-title a').attr('href')!.replace('/course-directory/course/', '');

    const zip = (clean(el.find('.views-field-field-course-location-1').text()) as string)
      .replace(/\s/g, '');

    const zipReplacement = replacements.get(zip);

    courses.push(
      new Course(
        id,
        el.find('.views-field-title a').text(),
        el
          .find('.views-field-field-course-location')
          .text()
          .replace(/\n/, ''),
        el.find('.addressfield-state').text(),
        zipReplacement || zip,
                clean(
                  el.find('.views-field-field-course-holes').text(),
                  'num',
                ) as number,
                clean(
                  el
                    .find('.average-rating')
                    .text()
                    .replace(/Average: /, ''),
                  'num',
                ) as number,
      ),
    );
  });

  return {
    courses,
    hasMore: $('.pager-last.last').length > 0,
  };
}
