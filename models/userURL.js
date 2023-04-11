import mongoose from "mongoose";

const userURLScheme = new mongoose.Schema(
    {
        user_id: {
            type: String,
            required:true,
            default:"anonim",
        },
        url_id: {
            type: String,
            required: true,
        }
    }
);

const userURL = mongoose.model("userURL", userURLScheme);

export default userURL;
