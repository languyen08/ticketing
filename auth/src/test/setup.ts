import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { app } from "../app";
import request from "supertest";

declare global {
    namespace NodeJS {
        export interface Global {
            signin: () => Promise<string[]>;
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

global.signin = async () => {
    const email = 'test@test.com';
    const password = 'password';

    const response = await request(app)
        .post('/api/users/signup')
        .send({
            email: email,
            password: password
        })
        .expect(201);
    const cookie = response.get("Set-Cookie");

    if (!cookie) {
        throw new Error("Failed to get cookie from response");
    }
    return cookie;
};
