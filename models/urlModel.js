import mongoose from "mongoose";

const urlSchema = new mongoose.Schema(
    {
        url: {
            required: true,
            type: String,
        },
        shortened_url: {
            required: true,
            type: String
        },
        created_at: {
            type: Date
        },
        clicks: {
            type: Number,
            required: true,
            default: 0,
        }, 
        user_id: {
            type: String,
            required:true,
            default:"anonim",
        },
    }, 
    {
        expireAt: {type: Date, expires: 987}
    }
);


const URL = mongoose.model("URL", urlSchema);

export default URL;
