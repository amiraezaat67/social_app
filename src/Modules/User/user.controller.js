

import  { Router} from 'express'
import * as UserServices from './Services/profile.service.js';
import { errorHandler } from '../../Middleware/error-handler.middleware.js';
import { Multer } from '../../Middleware/multer.middleware.js';
import { ImageExtensions } from '../../constants/constants.js';
import { authenticationMiddleware } from '../../Middleware/authentication.middleware.js';

const userController = Router()


userController.patch(
    '/upload-profile',
    authenticationMiddleware(),
    // Multer('Users/Profile', ImageExtensions).single('image'),
    errorHandler(UserServices.uploadProfilePicture) 
)

userController.patch(
    '/upload-covers',
    authenticationMiddleware(),
    // Multer('Users/Covers', ImageExtensions).array('image', 2),
    errorHandler(UserServices.uploadCoverPictures) 
)


userController.post(
    '/upload-cloud-profile',
    authenticationMiddleware(),
    // Multer('Users/Profile', ImageExtensions).single('image'),
    errorHandler(UserServices.UploadCLoudProfile) 
)

userController.post(
    '/upload-cloud-cover',
    authenticationMiddleware(),
    // Multer('Users/Covers', ImageExtensions).array('image', 2),
    errorHandler(UserServices.UploadCLoudCover) 
)

userController.patch(
    '/update-profile-picture',
    authenticationMiddleware(),
    // Multer('Users/Profile', ImageExtensions).single('image'),
    errorHandler(UserServices.UpdateProfilePicture)
)
export  {userController}
