import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.48/deno-dom-wasm.ts";
import { z } from "https://deno.land/x/zod@v3.23.8/mod.ts";

export const course = z.object({
  id: z.string(),
  name: z.string(),
  city: z.string().trim(),
  state: z.string(),
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

export function extractCoursesFromHtml(html: string): ExtractCoursesResponse {
  const $ = new DOMParser().parseFromString(html, "text/html");
  const rows = $.querySelectorAll("tbody tr");

  const courses: Course[] = [];

  [...rows].forEach((el) => {
    const id = el.querySelector(".views-field-title a")?.getAttribute("href");

    const zip = el.querySelector(".views-field-field-course-location-1")
      ?.textContent
      .replace(/\s/g, "");

    courses.push(
      course.parse({
        id,
        yearEstablished: el.querySelector(
          ".views-field-field-course-year-established",
        )
          ?.textContent,
        name: el.querySelector(".views-field-title a")?.textContent,
        city: el
          .querySelector(".views-field-field-course-location")?.textContent
          .replace(/\n/, ""),
        state: el.querySelector(".addressfield-state")?.textContent,
        zip: zip,
        holeCount: el.querySelector(".views-field-field-course-holes")
          ?.textContent,
        rating: el
          .querySelector(".average-rating")
          ?.textContent
          .replace(/Average: /, ""),
      }),
    );
  });

  return {
    courses,
    hasMore: $.querySelectorAll(".pager-last.last").length > 0,
    totalCourses: $.querySelector(".view-footer")?.textContent.trim().split(" ")
      .pop(),
  };
}
