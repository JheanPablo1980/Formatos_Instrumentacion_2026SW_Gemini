import { openDB, type IDBPDatabase } from 'idb';

const DB_NAME = 'protocolos_ic_db';
const DB_VERSION = 5;

export const initDB = async (): Promise<IDBPDatabase> => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('perfiles')) {
        db.createObjectStore('perfiles', { keyPath: 'ID_PERFIL' });
      }
      if (!db.objectStoreNames.contains('fotos')) {
        db.createObjectStore('fotos', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('instrumentos')) {
        db.createObjectStore('instrumentos', { keyPath: 'TAG' });
      }
      if (!db.objectStoreNames.contains('config')) {
        db.createObjectStore('config', { keyPath: 'id' });
      }
    },
  });
};
