import dotenv from 'dotenv'
dotenv.config();
export const Server = require('./models/server');

const server = new Server();

server.listen();