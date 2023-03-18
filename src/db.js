import dbJson from '../db.json' assert { type: 'json' };
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'

export const startDB = async () => {
  const directory = dirname(fileURLToPath(import.meta.url));
  const filePath = join(directory.replace('src', ''), 'db.json');
  const adapter = new JSONFile(filePath);
  const db = new Low(adapter);

  db.data ||= { lastPost: dbJson.lastPost }
  await db.write();

  return db;
};
