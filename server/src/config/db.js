import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

//create DB
const DB=new Database(path.join(import.meta.dirname,'../database.sqlite'));
//enable foreign keys
DB.pragma('foreign_keys=ON');
export default DB;