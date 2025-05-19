import { getCachedCourses } from "./getCachedCourses.ts";
import { stringify } from "@std/csv";

import {
  Course,
  extractCoursesFromHtml,
  ExtractCoursesResponse,
} from "./html-to-courses.ts";

// Learn more at https://docs.deno.com/runtime/manual/examples/module_metadata#concepts
if (import.meta.main) {
  await orchestrator();
}

// todo: except for the first page, pull from cache
async function orchestrator() {
  console.time("program");
  const courses = await getCachedCourses();

  let go = true;
  let index = 1;
  let totalCourses: string | undefined;
  while (go) {
    console.log(
      `Getting page. Index=${index}, page=${index - 1}. ${
        (index - 1) * 50
      }/${totalCourses}`,
    );

    let alreadyLoadedAll = true;
    const result = await getAndParsePageHtml(index);
    console.log(`Found ${result.courses.length} courses`);
    result.courses.forEach((course: Course) => {
      const existingCourse = courses.find((c) => c.id === course.id);
      if (!existingCourse) {
        alreadyLoadedAll = false;
        courses.push({
          ...course,
          page: index - 1,
        });
      }
    });

    if (alreadyLoadedAll) {
      console.log(`All data loaded, no reason to page further`);
      go = false;
      break;
    }

    index++;
    go = result.hasMore;
    totalCourses = result.totalCourses;
  }

  await Deno.writeTextFile("data.json", JSON.stringify(courses, null, 2));

  console.log("Creating file data.csv...");
  const csv = stringify(courses, {
    columns: [
      "id",
      "name",
      "city",
      "state",
      "zip",
      "holeCount",
      "rating",
      "yearsEstablished",
      "page",
    ],
  });
  await Deno.writeTextFile("data.csv", csv);

  console.log("Overview", { count: courses.length });
  console.timeEnd("program");
}

// Get files pages of data
// https://www.pdga.com/course-directory/advanced?order=field_course_year_established&sort=desc

// todo: we want to seperate the loading of html and the parsing of data... but you also want the latest data so
// you can't assume the first page should come from cache as it could have new data
async function getAndParsePageHtml(
  page: number,
): Promise<ExtractCoursesResponse> {
  const url =
    `https://www.pdga.com/course-directory/advanced?title=&field_course_location_country=US&field_course_location_locality=&field_course_location_administrative_area=All&field_course_location_postal_code=&field_course_type_value=All&rating_value=All&field_course_holes_value=All&field_course_total_length_value=All&field_course_target_type_value=All&field_course_tee_type_value=All&field_location_type_value=All&field_course_camping_value=All&field_course_facilities_value=All&field_course_fees_value=All&field_course_handicap_value=All&field_course_private_value=All&field_course_signage_value=All&field_cart_friendly_value=All&order=field_course_year_established&sort=desc${
      page === 1 ? "" : "&page=" + (page - 1)
    }`;
  const resp = await fetch(
    url,
  );
  const html = await resp.text();
  return extractCoursesFromHtml(html);
}
