
import express from 'express'
import controllerHandler from './utils/routers-handler.js'
import {database_connection} from './DB/connection.js'
import { config } from 'dotenv'
import cors from 'cors'
config()


const whitelist = [process.env.FRONTEND_ORIGIN , undefined]
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}
const bootstrap = async () => {
    const app = express()
    
    const port = process.env.PORT || 3000

    app.use(express.json())

    app.use(cors(corsOptions))
    // Handel all project controllers
    controllerHandler(app,express)

    database_connection()
    
    app.listen(port, () => {
        console.log('Social App server is running on port ' , port)
    })
}


export default bootstrap


