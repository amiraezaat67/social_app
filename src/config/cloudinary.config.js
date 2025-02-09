import { v2 as cloudinaryV2 } from 'cloudinary'


export const cloudinary =  () =>{
    cloudinaryV2.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,  // dkdyoufcl
        api_key: process.env.CLOUDINARY_API_KEY, // 324239215272649
        api_secret: process.env.CLOUDINARY_API_SECRET  // DPy0Zb5dOFpfPj55XowoOcO_S3A
    })

    return cloudinaryV2
}