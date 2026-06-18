import * as blogController from "../controllers/blog.controller.js";
import { Router } from "express";
import { requireAuth } from "../middlewares/requireAuth.middleware.js";
const blogRouter = Router()

blogRouter.use(requireAuth);

blogRouter.post('/',blogController.createBlog)
blogRouter.get('/',blogController.getBlogs)
blogRouter.get('/my-blogs',blogController.getMyBlogs)
blogRouter.delete("/delete-all", blogController.deleteAllBlogs);

blogRouter.put('/:id',blogController.updateBlog)
blogRouter.delete('/:id',blogController.deleteBlog)

export default blogRouter;