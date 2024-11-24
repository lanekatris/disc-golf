import { assertEquals } from "@std/assert";
import { extractCoursesFromHtml } from "./html-to-courses.ts";

Deno.test(async function parseTest1() {
  const html = await Deno.readTextFile("texas-trouble.html");
  const courses = extractCoursesFromHtml(html);
  // console.log(courses);
  assertEquals(50, courses.courses.length);
});
