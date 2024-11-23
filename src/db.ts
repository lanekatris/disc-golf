import 'reflect-metadata';
import { createConnection as typeOrmConnection } from 'typeorm';
import { Course } from '../v2/entity/course';
import { Html } from '../v2/entity/html';
import {AppConfiguration} from "./configuration";

export function createDbConnection(dbPath?: string) {

  const database = dbPath || new AppConfiguration().databasePath

  return typeOrmConnection({
    type: 'sqlite',
    database,
    entities: [
      Course,
      Html,
    ],
    synchronize: true,
    logging: false,
  });
}
