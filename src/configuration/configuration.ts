class EnvironmentVariableNotExistError extends Error {}

function getEnvironmentConfiguration(variableName: string, requireExists = true): string {
  const value = process.env[variableName];
  if (requireExists && !value) throw new EnvironmentVariableNotExistError();

  return value!;
}

export class AppConfiguration {
    public htmlDirectory: string;

    public replacements: Map<string, string>

    constructor() {
      this.htmlDirectory = getEnvironmentConfiguration('DG_HTML_DIRECTORY', false) || '/Users/lane/Documents/GitHub/disc-golf/dist/data';
      this.replacements = new Map();

      this.replacements
        .set('!8603', '18603')
        .set('', '');
    }
}
