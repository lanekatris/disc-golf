// import cheerio from 'npm:cheerio@1.0.0'
import {Course, extractCoursesFromHtml, ExtractCoursesResponse,} from "./html-to-courses.ts";
// import { Database } from "jsr:@db/sqlite@0.12";
// import { writeFile } from "jsr:@std/fs";

// const db = new Database("dg-v2.db");

export function add(a: number, b: number): number {
  return a + b;
}

// Learn more at https://docs.deno.com/runtime/manual/examples/module_metadata#concepts
if (import.meta.main) {
  console.log("Add 2 + 3 =", add(2, 3));
  // idk()
  await orchestrator();
}

async function orchestrator() {
  console.time('program')
  let existingData = "[]";
  try {
    existingData = await Deno.readTextFile("data.json");
  } catch (e) {
    console.error(e);
  }
  const courses: Course[] = JSON.parse(existingData);

  let go = true;
  let index = 0;
  let totalCourses: string | undefined;
  while (go) {
    console.log(`Getting page: ${index}, ${index * 50} / ${totalCourses}`);

    let alreadyLoadedAll = true;
    const result = await idk(index);
    result.courses.forEach((course: Course) => {
      const existingCourse = courses.find((c) => c.id === course.id);
      if (!existingCourse) {
        console.log(`Adding course to array: ${course.id}`);
        alreadyLoadedAll = false;
        courses.push(course);
      }
    });

    if (alreadyLoadedAll) {
      console.log(`All data loaded, no reason to page further`);
      go = false;
      break;
    }

    // Write to file once in a while or use sqlite...
    if (index !== 0 && index % 5 === 0) {
      console.log(`Periodic file write, index: ${index}...`)
      await Deno.writeTextFile("data.json", JSON.stringify(courses, null, 2));
    }

    index++;
    go = result.hasMore;
    totalCourses = result.totalCourses
  }

  await Deno.writeTextFile("data.json", JSON.stringify(courses, null, 2));
  console.log("Overview", { count: courses.length });
  console.timeEnd('program')
}

// Get files pages of data
// https://www.pdga.com/course-directory/advanced?order=field_course_year_established&sort=desc

// we want to seperate the loading of html and the parsing of data... but you also want the latest data so
// you can't assume the first page should come from cache as it could have new data
async function idk(page: number): Promise<ExtractCoursesResponse> {
  // load existing data
  // const existingData = await Deno.readTextFile('data.json')
  // const courses: Course[] = JSON.parse(existingData);

  // const resp = await fetch('https://www.pdga.com/course-directory/advanced?order=field_course_year_established&sort=desc')
  const resp = await fetch(
      // `https://www.pdga.com/course-directory/advanced?title=&field_course_location_country=US&field_course_location_locality=&field_course_location_administrative_area=ALL&field_course_location_postal_code=&field_course_type_value=All&rating_value=All&field_course_holes_value=All&field_course_total_length_value=All&field_course_target_type_value=All&field_course_tee_type_value=All&field_location_type_value=All&field_course_camping_value=All&field_course_facilities_value=All&field_course_fees_value=All&field_course_handicap_value=All&field_course_private_value=All&field_course_signage_value=All&field_cart_friendly_value=All&order=field_course_year_established&sort=desc${page === 0 ? "" : "&page=" + page}`

      `https://www.pdga.com/course-directory/advanced?title=&field_course_location_country=US&field_course_location_locality=&field_course_location_administrative_area=All&field_course_location_postal_code=&field_course_type_value=All&rating_value=All&field_course_holes_value=All&field_course_total_length_value=All&field_course_target_type_value=All&field_course_tee_type_value=All&field_location_type_value=All&field_course_camping_value=All&field_course_facilities_value=All&field_course_fees_value=All&field_course_handicap_value=All&field_course_private_value=All&field_course_signage_value=All&field_cart_friendly_value=All&order=field_course_year_established&sort=desc${page === 0 ? "" : "&page=" + page}`
  );
  // https://www.pdga.com/course-directory/advanced?title=&field_course_location_country=US&field_course_location_locality=&field_course_location_administrative_area=WV&field_course_location_postal_code=&field_course_type_value=All&rating_value=All&field_course_holes_value=All&field_course_total_length_value=All&field_course_target_type_value=All&field_course_tee_type_value=All&field_location_type_value=All&field_course_camping_value=All&field_course_facilities_value=All&field_course_fees_value=All&field_course_handicap_value=All&field_course_private_value=All&field_course_signage_value=All&field_cart_friendly_value=All&page=1
  // https://www.pdga.com/course-directory/advanced?title=&field_course_location_country=US&field_course_location_locality=&field_course_location_administrative_area=OH&field_course_location_postal_code=&field_course_type_value=All&rating_value=All&field_course_holes_value=All&field_course_total_length_value=All&field_course_target_type_value=All&field_course_tee_type_value=All&field_location_type_value=All&field_course_camping_value=All&field_course_facilities_value=All&field_course_fees_value=All&field_course_handicap_value=All&field_course_private_value=All&field_course_signage_value=All&field_cart_friendly_value=All
  const html = await resp.text();
  return extractCoursesFromHtml(html);
}