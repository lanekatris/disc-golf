class EnvironmentVariableNotExistError extends Error {}

function getEnvironmentConfiguration(variableName: string, requireExists = true): string {
  const value = process.env[variableName];
  if (requireExists && !value) throw new EnvironmentVariableNotExistError(variableName);

  return value!;
}

export class AppConfiguration {
    public databasePath: string;

    public googleMapsApiKey: string;

    constructor() {
      this.databasePath = getEnvironmentConfiguration('DG_DB_PATH', false) || 'dg.db';
      this.googleMapsApiKey = getEnvironmentConfiguration('API_KEY_GEOCODING');
    }
}
