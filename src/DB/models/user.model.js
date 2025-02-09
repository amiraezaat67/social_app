import mongoose from "mongoose";
import { genderEnum, ProvidersEnum, systemRoles } from "../../constants/constants.js";

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: [true,'username is required'],
        lowercase: true,
        trim: true
    },
    email:{
        type: String,
        required: [true, 'Email is required'],
        unique: 'idx_email_unique'
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    phone:String,
    isDeactived: {
        type: Boolean,
        default: false
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    profilePicture:String,
    coverPictures:[String],
    profilePictureCloud:{
        secure_url:String,
        public_id:{
            type: String,
            // required: [true, 'Public id is required'],
            // unique: 'idx_public_id_unique'
        },
        folderId:{
            type: String,
            // required: [true, 'Folder id is required'],
            // unique: 'idx_folder_id_profile_unique'
        }
    },
    coversCloud:{
        Images:[{
            secure_url:String,
            public_id:{
                type: String,
                // required: [true, 'Public id is required'],
                // unique: 'idx_public_id_unique'
            },
        }],
        folderId:{
            type: String,
            // required: [true, 'Folder id is required'],
            // unique: 'idx_folder_id_cover_unique'
        } 
    },
    confirmOtp:String,
    forgetOtp:String,
    role:{
        type: String,
        default: systemRoles.USER,
        enum: Object.values(systemRoles)
    },
    isPublic:{
        type: Boolean,
        default: true
    },
    DOB:Date,
    gender:{
        type: String,
        enum:Object.values(genderEnum),
        default: genderEnum.NOT_SPECIFIED
    },
    provider:{
        type: String,
        default:ProvidersEnum.SYSTEM,
        enum: Object.values(ProvidersEnum)
    }
},{
    timestamps: true
})

const User = mongoose.models.User || mongoose.model('User',userSchema)

export {User}