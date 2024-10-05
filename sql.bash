npx wrangler d1 execute stories --remote --file=stories.sql

npx wrangler d1 execute stories --remote --command="insert into stories (title, content) values ('First Story', 'This is the first story');"

npx wrangler d1 execute stories --remote --command="select * from stories;"
