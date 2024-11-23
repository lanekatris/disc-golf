import { assertEquals } from "@std/assert";
import { add } from "./main.ts";
import {extractCoursesFromHtml} from "./html-to-courses.ts";

Deno.test(function addTest() {
  assertEquals(add(2, 3), 5);
});

Deno.test(async function parseTest1(){

 const html = await Deno.readTextFile("texas-trouble.html");
 const courses = extractCoursesFromHtml(html);
 assertEquals(530, courses.courses.length)
})