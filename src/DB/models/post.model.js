
import mongoose from "mongoose"

const postSchema = new mongoose.Schema({
    title:{
        type: String,
        required: [true, 'Title is required'],
        trim: true
    },
    description: String,
    ownerId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Owner id is required']
    },
    allowComments: {
        type: Boolean,
        default: true
    },
    tags: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }
    ],
    images:[
        {
            secure_url:String,
            public_id:{
                type: String,
            }
        }
    ],
    folderId:String
},{
    timestamps: true
})


// apply hook to send email for the taged ones

export const Post = mongoose.models.Post || mongoose.model('Post',postSchema)