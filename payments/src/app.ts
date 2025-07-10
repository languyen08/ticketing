import 'express-async-errors';
import express, { Express } from "express";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import { currentUser, errorHandler, NotFoundError } from "@ntlantickets/common";

const app: Express = express();
app.set('trust proxy', true);
app.use(json());
app.use(
    cookieSession({
        signed: false,
        secure: process.env.NODE_ENV !== 'test'
    })
)
app.use(currentUser);

app.all('*', async () => {
    throw new NotFoundError();
})

app.use(errorHandler);

export { app }
