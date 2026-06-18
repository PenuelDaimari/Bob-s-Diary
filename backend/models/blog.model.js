import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
    title: {
        type:String,
        required:[true,"Blog Title is required"],
        trim: true,
        minlength: [1, "Title cannot be empty"],
        maxlength: [200, "Title cannot exceed 200 characters"],
    },
    content: {
        type:String,
        required:[true,"Blog Content is required"],
    },
    author: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'users',
        required:true,
    }
},{timestamps:true});

export default mongoose.model('blogs',blogSchema);