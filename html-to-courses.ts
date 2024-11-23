// import cheerio from 'cheerio';

import * as cheerio from "https://esm.sh/cheerio@1.0.0-rc.12";
// import { Course } from './entity/course.ts';
import { z } from "https://deno.land/x/zod@v3.23.8/mod.ts";

export const course = z.object({
  id: z.string(),
  name: z.string(),
  city: z.string().trim(),
  state: z.string(),
  // zip: z.string(),
  zip: z.string().optional(),
  holeCount: z.coerce.number(),
  rating: z.coerce.number().optional(),
  yearEstablished: z.coerce.number(),
    page: z.number().optional(),
});

export type Course = z.infer<typeof course>;

export interface ExtractCoursesResponse {
  courses: Course[];
  hasMore: boolean;
  totalCourses?: string;
}

// function clean(
//   input: string,
//   type: string = 'string',
// ): string | number {
//   const result = input.replace(/\n/, '');
//
//   if (type === 'num') return parseInt(result, 10);
//
//   return result;
// }

const replacements = new Map().set("!8603", "18603");

export function extractCoursesFromHtml(html: string): ExtractCoursesResponse {
  const $ = cheerio.load(html);
  const rows = $("tbody tr");

  const courses: Course[] = [];

  rows.each((index: number, element: any) => {
    const el = $(element);
    const id = el.find(".views-field-title a").attr("href");

    const zip = el.find(".views-field-field-course-location-1").text()
      .replace(/\s/g, "");

    // const zipReplacement = replacements.get(zip);

    courses.push(
      course.parse({
        id,
        yearEstablished: el.find(".views-field-field-course-year-established")
          .text(),
        name: el.find(".views-field-title a").text(),
        city: el
          .find(".views-field-field-course-location")
          .text()
          .replace(/\n/, ""),
        state: el.find(".addressfield-state").text(),
        zip: zip,
        holeCount: el.find(".views-field-field-course-holes").text(),
        rating: el
          .find(".average-rating")
          .text()
          .replace(/Average: /, ""),
      }),
    );
  });

  return {
    courses,
    hasMore: $(".pager-last.last").length > 0,
      totalCourses: $(".view-footer").text().trim().split(' ').pop()
  };
}
