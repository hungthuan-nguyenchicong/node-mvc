# install

curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash

source ~/.bashrc

nvm --version

nvm install --lts

nvm install node

nvm ls

nvm use 18.17.1

## cài đặt project
npm init -y

### Cài đặt Express
npm install express

### Cài đặt nodemon làm dev dependency
npm install --save-dev nodemon

## add module es6
"type": "module",

"dev": "cd backend && nodemon server.js"

## Install the Proxy Middleware
npm install http-proxy-middleware --save-dev

## Run Both Servers

npm install concurrently --save-dev

"scripts": {
  "dev": "concurrently \"node server.js\" \"vite\""
}

## node-fetch

npm install node-fetch --save-dev

## vite

npm install --save-dev vite@latest

