import { compareSync, hashSync } from "bcrypt"
import { User } from "../../../DB/models/index.js"
import { Encryption } from "../../../utils/crypto.utils.js"
import { EmailEvent } from "../../../Services/send-email.service.js"
import { generateToken } from "../../../utils/tokens.utils.js"
import {OAuth2Client} from 'google-auth-library';

import {v4 as uuidv4} from 'uuid'
import { ProvidersEnum } from "../../../constants/constants.js"


export const SignUpService = async (req,res) => {
    const {username , email , password , phone , gender, DOB , privateAccount } = req.body

    // Middleware
    const isEmailExists = await User.findOne({email})
    if(isEmailExists){
        return res.status(400).json({ message: 'Email already exists' })
    }

    // hash password
    const hashedPassword = hashSync(password, +process.env.SALT_ROUNDS)
    // encrypt phone
    const encryptedPhone = await Encryption({value:phone , secret:process.env.ENCRYPTION_SECRET_KEY})  

    // isPublic
    const isPublic = privateAccount ? false : true

    // confirmation
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const hashedOtp = hashSync(otp, +process.env.SALT_ROUNDS)

    // send email
    EmailEvent.emit('sendEmail' , {
        subject:"Confirm your email",
        html:`<h1>${otp}</h1>`,
        email,
    })

    // create user
    const user = new User({
        username,
        email,
        password:hashedPassword,
        phone:encryptedPhone,
        isPublic,
        confirmOtp:hashedOtp,
        gender,
        DOB
    })
    await user.save()

    res.status(201).json({ message: 'User created successfully' })
}


export const ConfirmEmailService = async (req,res) => {

    const {otp , email} = req.body

    const user = await User.findOne({email , isVerified:false, confirmOtp:{$exists:true}})
    if(!user){
        return res.status(400).json({ message: 'User not found' })
    }

    const isOtpValid = compareSync(otp, user.confirmOtp)
    if(!isOtpValid){
        return res.status(400).json({ message: 'Invalid otp' })
    }

    await User.findByIdAndUpdate(user._id ,{isVerified:true, $unset:{confirmOtp:""}})

    res.status(200).json({ message: 'Email confirmed successfully' })
}


export const SignInService = async (req,res) => {

    const {email , password} = req.body

    const user = await User.findOne({email , isVerified:true})
    if(!user){
        return res.status(400).json({ message: 'User not found' })
    }

    const isPasswordValid = compareSync(password, user.password)
    if(!isPasswordValid){
        return res.status(400).json({ message: 'Invalid password' })
    }

    const accesstoken = generateToken({
        publicClaims:{_id:user._id },
        registeredClaims:{expiresIn:process.env.ACCESS_TOKEN_EXPIRATION_TIME , jwtid:uuidv4()},
        secretKe:process.env.JWT_SECRET_KEY
    })

    const refreshtoken = generateToken({
        publicClaims:{_id:user._id },
        registeredClaims:{expiresIn:process.env.REFRESH_TOKEN_EXPIRATION_TIME , jwtid:uuidv4()},
        secretKe:process.env.JWT_SECRET_KEY_REFRESH
    })

    res.status(200).json({ message: 'User logged in successfully',accesstoken,refreshtoken })
    
}


export const GmailLoginService = async (req,res) => {
    
    const { idToken } = req.body
    const client = new OAuth2Client();

    const ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.CLIENT_ID
    });
    const payload = ticket.getPayload();
    const { email_verified  , email } = payload
    if(!email_verified){
        return res.status(400).json({ message: 'Invalid gmail credentials' })
    }

    const user = await User.findOne({email , provider:ProvidersEnum.GOOGLE})
    if(!user){
        return res.status(400).json({ message: 'User not found' })
    }

    
    const accesstoken = generateToken({
        publicClaims:{_id:user._id },
        registeredClaims:{expiresIn:process.env.ACCESS_TOKEN_EXPIRATION_TIME , jwtid:uuidv4()},
        secretKe:process.env.JWT_SECRET_KEY
    })

    const refreshtoken = generateToken({
        publicClaims:{_id:user._id },
        registeredClaims:{expiresIn:process.env.REFRESH_TOKEN_EXPIRATION_TIME , jwtid:uuidv4()},
        secretKe:process.env.JWT_SECRET_KEY_REFRESH
    })

    res.status(200).json({ message: 'User logged in successfully' , tokens:{accesstoken,refreshtoken} })
}


export const GmailRegisterService = async (req,res) => {
    const { idToken } = req.body
    const client = new OAuth2Client();

    const ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.CLIENT_ID
    });
    const payload = ticket.getPayload();
    const { email_verified  , email , name} = payload
    if(!email_verified){
        return res.status(400).json({ message: 'Invalid gmail credentials' })
    }

    const isEmailExists = await User.findOne({email})
    if(isEmailExists){
        return res.status(400).json({ message: 'User already exists' })
    }

    // create user
    const user  = new User({
        username:name,
        email,
        provider:ProvidersEnum.GOOGLE,
        isVerified:true,
        password:hashSync(uuidv4(), +process.env.SALT_ROUNDS)
    })

    await user.save()

    res.status(200).json({ message: 'User registered successfully' })
}
