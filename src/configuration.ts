class EnvironmentVariableNotExistError extends Error {}

function getEnvironmentConfiguration(variableName: string, requireExists = true): string {
  const value = process.env[variableName];
  if (requireExists && !value) throw new EnvironmentVariableNotExistError(variableName);

  return value!;
}

export interface Coordinates {
    latitude: number
    longitude: number
}

export class AppConfiguration {
    public databasePath: string;

    public googleMapsApiKey: string;

    public coordinateOverrides: Map<string, Coordinates>;

    public excludedCourseIds: string[];

    public csvPath: string;

    constructor() {
      this.databasePath = getEnvironmentConfiguration('DG_DB_PATH', false) || 'dg.db';
      this.csvPath = getEnvironmentConfiguration('DG_CSV_PATH', false) || 'courses.csv';
      this.googleMapsApiKey = getEnvironmentConfiguration('API_KEY_GEOCODING');
      this.coordinateOverrides = new Map<string, Coordinates>([
        // From course detail section from pdga.com
        ['/Depot%20Disc%20Golf', {
          latitude: 32.999220035374,
          longitude: -82.814413428302,
        }],
        // From course detail section from pdga.com
        ['max-e-roper-insterstate-park-east', {
          latitude: 40.846514521818,
          longitude: -96.709773585212,
        }],
      ]);

      // Can't find anythig for this on google maps or on pdga.com
      this.excludedCourseIds = ['gypsum-disc-golf-course'];

      // TODO: We need to not worry about /max-e-roper-insterstate-park-east
    }

    getCourseUrl(courseName: string) {
      return `https://www.pdga.com/course-directory/course/${courseName}`;
    }
}
