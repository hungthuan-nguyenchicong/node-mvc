# npm i dotenv

npm i dotenv

import dotenv from 'dotenv'

dotenv.config({ path: '/custom/path/to/.env' })

# .gitignore
.env*

.env

.env.dev

# path

import path from 'path';

Default: path.resolve(process.cwd(), '.env')

# change to true to suppress

{ quiet: true }