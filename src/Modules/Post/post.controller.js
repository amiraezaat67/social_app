
import {  Router } from "express";  
import * as postService from './Services/post.service.js'
import { authenticationMiddleware } from "../../Middleware/authentication.middleware.js";
import { Multer } from "../../Middleware/multer.middleware.js";
import { ImageExtensions } from "../../constants/constants.js";
const postController = Router();

postController.post(
    '/create-post',
    authenticationMiddleware(), 
    // Multer('Posts', ImageExtensions).array('image', 5),
    postService.createPost)

export {postController}