import cheerio from 'cheerio';

export interface ExtractCourseResponse {
    street: string
    locality: string
    country: string
}

export function extractAddressFromHtml(html: string): ExtractCourseResponse {
  const $ = cheerio.load(html);
  return {
    street: $('.street-block').text(),
    locality: $('.locality-block').text(),
    country: $('.country').text(),
  };
}
