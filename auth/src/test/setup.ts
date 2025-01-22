import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

let mongo: MongoMemoryServer;
beforeAll(async () => {
    process.env.JWT_KEY = 'asdf';
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

})