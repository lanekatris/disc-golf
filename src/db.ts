import 'reflect-metadata';
import { createConnection as typeOrmConnection } from 'typeorm';
import { Course } from './course';

export function createDbConnection(dbPath: string) {
  return typeOrmConnection({
    type: 'sqlite',
    database: dbPath,
    entities: [
      Course,
    ],
    synchronize: true,
    logging: false,
  });
}
