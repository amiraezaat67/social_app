import { nanoid } from "nanoid"
import { cloudinary } from "../../../config/cloudinary.config.js"
import { Post, User } from "../../../DB/models/index.js"



export const createPost = async (req,res) => {
    const  { _id } = req.loggedInUser
    const { title , description , tags, allowComments } = req.body
    const {files} = req

    const postObject ={
        title,
        description,
        ownerId:_id,
        allowComments,
        images:[],
    }
    // check tags
    if(tags?.length){
        const isAllTagsExist = await User.find({_id:{$in:tags}})
        if(isAllTagsExist.length !== tags.length){
            return res.status(400).json({ message: 'There are tags that do not exist' })
        }
        postObject.tags = tags
    }
    if(files?.length){
        const folderId = nanoid(4)
        for (const file of files) {
            const  { secure_url, public_id } = await cloudinary().uploader.upload(file.path, {
                folder: `${process.env.CLOUDINARY_FOLDER}/Posts/${folderId}`
            })
            postObject.images.push({secure_url,public_id})
            postObject.folderId = folderId
        }
    }


    const post = new Post(postObject)
    const savedPost = await post.save()

    res.status(200).json({ message: 'Post created successfully' , post : savedPost })
}
