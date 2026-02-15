import DB from "./db.js";

//create tables
function DBinit(){
    DB.exec(`
        CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
 create table if not exists documents(
        fileID integer primary key autoincrement,
        filename text not null,
        content text not null,
        uploader_id integer,
        status text default 'processing',
        created_at datetime default current_timestamp,
        foreign key (uploader_id) references users(id));
    `);
};
export default DBinit;