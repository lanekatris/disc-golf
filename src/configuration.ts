class EnvironmentVariableNotExistError extends Error {}

function getEnvironmentConfiguration(variableName: string, requireExists = true): string {
  const value = process.env[variableName];
  if (requireExists && !value) throw new EnvironmentVariableNotExistError(variableName);

  return value!;
}

export class AppConfiguration {
    public htmlDirectory: string;

    public googleMapsApiKey: string;

    constructor() {
      this.htmlDirectory = getEnvironmentConfiguration('DG_HTML_DIRECTORY', false) || '/Users/lane/Documents/GitHub/disc-golf/dist/data';
      this.googleMapsApiKey = getEnvironmentConfiguration('API_KEY_GEOCODING');
    }
}
