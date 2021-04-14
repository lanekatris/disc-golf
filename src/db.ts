import 'reflect-metadata';
import { createConnection as typeOrmConnection } from 'typeorm';
import { Course } from './course';
import { Html } from './html';

export function createDbConnection(dbPath: string) {
  return typeOrmConnection({
    type: 'sqlite',
    database: dbPath,
    entities: [
      Course,
      Html,
    ],
    synchronize: true,
    logging: false,
  });
}
