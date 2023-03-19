import express, { Express, Request, Response } from "express";
import dotenv from 'dotenv';
import bodyParser from "body-parser";
import { RegisterController } from "./controllers/register.controller";

dotenv.config();

const jsonParser = bodyParser.json();
const app: Express = express();
const port = process.env.PORT;

app.post('/register', jsonParser ,RegisterController);

app.listen(port, () => {
    console.log('Szerver elindult '+port+' porton.');
});