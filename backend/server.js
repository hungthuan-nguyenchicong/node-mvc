// backend/server.js
import dotenv from 'dotenv';
import path from 'path';

// project -> /var/www/html/node-mvc
const pathRoot = path.resolve(process.cwd(), '..');

// dotenv
// process.env.npm_lifecycle_event -> dev built
const runEvent = process.env.npm_lifecycle_event;

// fileEnv -> npm run dev -> /var/www/html/node-mvc/ -> .dev -> .env 
// npm run dev -> .dev.env
const fileEnv = path.join(pathRoot, '.' + runEvent + '.env');

if (runEvent === 'dev' || runEvent === 'start') {
    dotenv.config({ path: fileEnv});;
}
//console.log('run event: ' + process.env.RUN_EVENT)


console.log(process.env.NODE_ENV)