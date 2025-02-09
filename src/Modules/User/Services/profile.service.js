import { nanoid } from "nanoid"
import { cloudinary } from "../../../config/cloudinary.config.js"
import { User } from "../../../DB/models/index.js"

export const uploadProfilePicture = async (req,res) => {
    const { file } = req
    if(!file){
        return res.status(400).json({ message: 'No file uploaded' })
    }
    const {_id} = req.loggedInUser

    const baseUrl =`${req.protocol}://${req.headers.host}/${file.path}`
    const user = await User.findByIdAndUpdate(_id ,{profilePicture:baseUrl})

    res.status(200).json({ message: 'Profile picture uploaded successfully' , user })
}

export  const uploadCoverPictures = async (req,res) => {
    const { files } = req
    if(!files.length){
        return res.status(400).json({ message: 'No file uploaded' })
    }

    const {_id} = req.loggedInUser

    const filesPaths = files.map(file => `${req.protocol}://${req.headers.host}/${file.path}` )
    console.log(filesPaths);
    
    const user = await User.findByIdAndUpdate(_id ,{coverPictures:filesPaths})

    res.status(200).json({ message: 'Cover picture uploaded successfully' , user })
}

export const UploadCLoudProfile = async (req,res) => {
    const {_id} = req.loggedInUser
    const {file} = req
    if(!file){    
        return res.status(400).json({ message: 'No file uploaded' })
    }

    const folderId = nanoid(4)
    const {secure_url,public_id}  = await cloudinary().uploader.upload(file.path, {
        folder: `${process.env.CLOUDINARY_FOLDER}/Users/Profile/${folderId}`
    })

    const user = await User.findByIdAndUpdate(_id ,{
        profilePictureCloud:{
            secure_url,
            public_id,
            folderId
        },
    })
    res.status(200).json({ message: 'Profile uploaded successfully' , user  })
}

export const UploadCLoudCover = async (req,res) => {
    const {_id} = req.loggedInUser
    const {files} = req

    if(!files.length){
        return res.status(400).json({ message: 'No files uploaded' })
    }

    const folderId = nanoid(4)
    const Images = []

    for (const file of files) {
        
        const {secure_url,public_id}  = await cloudinary().uploader.upload(file.path, {
            folder: `${process.env.CLOUDINARY_FOLDER}/Users/Cover/${folderId}`
        })

        Images.push({
            secure_url,
            public_id,
        })
    }

    const user = await User.findByIdAndUpdate(_id ,{
        coversCloud:{
            Images,
            folderId
        }
    })

    res.status(200).json({ message: 'Cover uploaded successfully' , user  })
}



export const UpdateProfilePicture = async (req,res) => {
    // upload new picture
    // delete the existing one

    const {_id} = req.loggedInUser
    const {file} = req

    const user = await User.findById(_id)
    if(!user){
        return res.status(400).json({ message: 'User not found' })
    }
    const profile = user.profilePictureCloud

    if(!file){    
        // delete the exitsing one
        await cloudinary().uploader.destroy(profile.public_id)
        await cloudinary().api.delete_folder(profile.public_id.split(`${profile.folderId}`)[0] + profile.folderId)
        await User.findByIdAndUpdate(_id ,{$unset:{profilePictureCloud:""}})
        return  res.status(200).json({ message: 'Profile picture deleted successfully' })

    }  
    
    const {secure_url}  = await cloudinary().uploader.upload(file.path, {
        folder: `${process.env.CLOUDINARY_FOLDER}/Users/Profile/${profile.folderId}`,
        public_id:profile.public_id.split(`${profile.folderId}`)[1]
    })

    await User.findByIdAndUpdate(_id ,{'profilePictureCloud.secure_url':secure_url})

    res.status(200).json({ message: 'Profile picture updated successfully' })
}