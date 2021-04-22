const got = require('got');

export async function getHtml(url: string) {
    const { body } = await got(url);
    return body;
}
