-- create a stories table for SQLite-- drop table if exists stories;

DROP TABLE IF EXISTS stories;
CREATE TABLE stories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- create inserts.sql
insert into stories (title, content) values ('First Story', 'This is the first story');