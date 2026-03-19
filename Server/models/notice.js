import mongoose from "mongoose";

const noticeSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    }, 

    createdAt: {
        type: Date,
        default: Date.now
    },

    createdBy: {
        type: String,
        required: true
    }

})

export default mongoose.model("Notice", noticeSchema);
