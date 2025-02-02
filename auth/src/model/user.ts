import mongoose from "mongoose";
import { PasswordManager } from "../service/password-manager";

// An interface that describes the properties that are required to create a new User
interface UserAttributes {
    email: string;
    password: string;
}
// An interface that describes the properties that a User Model has
interface UserModel extends mongoose.Model<UserDoc> {
    build(userAttributes: UserAttributes): UserDoc;
}
// An interface that describes the properties that a User Document has
interface UserDoc extends mongoose.Document {
    email: string;
    password: string;
}

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.password;
            delete ret.__v;
        }
    }
});
userSchema.pre('save', async function (done) {
    if (this.isModified('password')) {
        const hashed = await PasswordManager.toHash(this.get('password')!);
        this.set('password', hashed);
    }
    done();
});
userSchema.statics.build = (userAttributes: UserAttributes) => {
    return new User(userAttributes);
};

const User: UserModel = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };
