import dotenv from 'dotenv'
dotenv.config();
import {Server} from "./src/models/ServerClass"

const server = new Server();

server.listen();