const fs = require('fs-extra');

const got = require('got');

export const downloadOrRead = async (
  url: string,
  filePath: string
): Promise<string> => {
  if (fs.existsSync(filePath)) {
    console.log('pulling from file');
    return fs.readFile(filePath);
  }

  console.log(`Calling website: ${url}`);
  const response = await got(url);

  await fs.outputFile(filePath, response.body);

  return response.body;
};
