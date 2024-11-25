import { Course } from "./html-to-courses.ts";

export async function getCachedCourses() {
  let existingData = "[]";
  try {
    existingData = await Deno.readTextFile("data.json");
  } catch (e) {
    console.error(e);
  }
  const courses: Course[] = JSON.parse(existingData);
  return courses;
}
