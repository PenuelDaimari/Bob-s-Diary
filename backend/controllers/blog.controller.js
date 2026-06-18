import blogModel from "../models/blog.model.js";

export const createBlog = async (req,res) => {
    try{
        const {title,content} = req.body;

        if(!title || !content) {
            return res.status(400).json({
                message:"Title and content are required"
            });
        }

        const newBlog = await blogModel.create({
            title,
            content,
            author:req.user._id
        });

        await newBlog.populate("author", "username");

        res.status(201).json({
            message:"Blog created successfully",
            blog:newBlog 
        })
    }
    catch(error){
        res.status(500).json({
            message:"Error creating blog",
            error:error.message
        })
    }
};

export const getBlogs = async (req,res) => {
    try{
        const blogs = await blogModel.find().populate("author","username").sort({createdAt:-1})
        res.status(200).json({ blogs })
    }
    catch(error){
        res.status(500).json({
            message:"Error fetching blogs",
            error:error.message
        })
    }
}

export const getMyBlogs = async (req,res) => {
    try{
        const userId = req.user._id;
        const blogs = await blogModel.find({author:userId}).populate("author", "username").sort({createdAt: -1})
        res.status(200).json({
            message:"Blogs fetched successfully",
            blogCount:blogs.length,
            blogs 
        })
    }
    catch(error){
        res.status(500).json({
            message:"Error fetching blogs",
            error:error.message
        })
    }
}

export const updateBlog = async (req,res) => {
    try{
        const {id} = req.params
        const{title,content} = req.body

        const blog = await blogModel.findById(id);

        if(!blog){
            return res.status(404).json({message:"Blog not found"})
        }

        if(blog.author.toString() !== req.user._id.toString()){
            return res.status(403).json({message:"Not authorized to edit this blog"})
        }

        blog.title = title || blog.title
        blog.content = content||blog.content
        await blog.save()

        await blog.populate("author", "username");

        res.status(200).json({
            message:"Blog updated successfully",
            blog
        })
    }
    catch(error){
        res.status(500).json({
            message:"Error updating blog",
            error: error.message
        })
    }
};

export const deleteBlog = async (req,res) => {
    try{
        const { id } = req.params
        const blog = await blogModel.findById(id);

        if(!blog){
            return res.status(404).json({
                message:"Blog not found"
            })
        }

        if(blog.author.toString() !== req.user._id.toString()){
            return res.status(403).json({message:"Not authorized to delete this blog"})
        }

        await blogModel.findByIdAndDelete(id)
        res.status(200).json({
            message:"Blog deleted successfully",
            blog
        })
    }
    catch(error){
        res.status(500).json({
            message:"Error deleting blog",
            error: error.message
        })
    }
}

export const deleteAllBlogs = async (req, res) => {
    try {
        const userId = req.user._id;

        const result = await blogModel.deleteMany({ author: userId });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "No blogs found to delete" });
        }

        res.status(200).json({ 
            message: "All your blogs have been deleted successfully",
            deletedCount: result.deletedCount 
        });
    } catch (error) {
        res.status(500).json({ message: "Error deleting blogs", error: error.message });
    }
};