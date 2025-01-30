import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

declare global {
    namespace NodeJS {
        export interface Global {
            signin: () => string[];
        }
    }
}
let mongo: MongoMemoryServer;
beforeAll(async () => {
    process.env.JWT_KEY = 'asdf';
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

    mongo = await MongoMemoryServer.create();
    const mongoUri: string = mongo.getUri();

    await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
    if (mongoose.connection.db) {
        const collections = await mongoose.connection.db.collections();

        for (let collection of collections) {
            await collection.deleteMany();
        }
    }
})

afterAll(async () => {
    if (mongo) {
        await mongo.stop();
    }
    await mongoose.connection.close();
});

global.signin = () => {
    // Build a JWT payload. { id, email }
    const payload = {
        id: 'test',
        email: 'test@test.com'
    }
    // Create the JWT!
    const token = jwt.sign(payload, process.env.JWT_KEY!);
    // Build session Object. { jwt: MY_JWT }
    const session = {jwt: token};
    // Turn that session into JSON
    const sessionJSON = JSON.stringify(session);
    // Take JSON and encode it as base64
    const base64 = Buffer.from(sessionJSON).toString('base64');
    // return a string that is the cookie with the encoded data
    return [`session=${base64}`];
};
