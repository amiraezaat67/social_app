import multer from 'multer'
import fs from 'fs'


export const Multer = (destinationPath ='general', allowedExtension =[])=>{

    const destinationFolder = `Assets/${destinationPath}`
    if( !fs.existsSync(destinationFolder)){
        fs.mkdirSync(destinationFolder, {recursive:true})
    }

    // diskStorage or memoryStorage
    const storage =  multer.diskStorage({
        // destination
        destination: function (req, file, cb) {
            cb(null, destinationFolder)
        },
        // filename
        filename: function (req, file, cb) {
            console.log(file); // before upload
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
            cb(null, uniqueSuffix+'__'+file.originalname)
        }
    })

    // fileFilter
    const fileFilter = (req, file, cb) => {
        if (allowedExtension.includes(file.mimetype)) {
            cb(null, true)
        } else {
            cb(new Error('Invalid file type'), false)
        }
    }

    const upload = multer({fileFilter , storage})
    return upload
}