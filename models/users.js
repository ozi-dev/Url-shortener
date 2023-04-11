import mongoose from "mongoose";

const usersScheme = new mongoose.Schema(
    {
        name: {
            required: true,
            type: String,
        },
        surname: {
            required: true,
            type: String
        },
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        phone_number: {
            type: String,
            required: true,
        },
    }
);

const users = mongoose.model("users", usersScheme);

export default users;
