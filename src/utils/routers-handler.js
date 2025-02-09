
// import rateLimit from 'express-rate-limit';
import { globalErrorHandler } from '../Middleware/index.js'
import * as controllers from  '../Modules/index.js'
// import axios from 'axios'

// import helmet from 'helmet';

// const limiters = { }
// async function getCountryFromIP(ip) {
//     try {
//         const response = await axios.get(`http://ip-api.com/json/${ip}`);  
//         return response.data.countryCode; // Returns the country code (e.g., "IN" for India)
//     } catch (error) {
//         console.error('Error fetching country from IP:', error);
//         return null;
//     }
//   }
  
// // Custom rate limit middleware
// const customRateLimiter = async (req, res, next) => {
// 	// get the client ip from 'x-forwarded-for' or the server ip from req.ip 
//     const ip = req.headers['x-forwarded-for'] || req.ip;
//     const country = await getCountryFromIP(ip);
    
//     console.log(country);
    
//     let maxRequests = 1; // Default limit for other countries
//     if (country === 'EG') {
//         maxRequests = 3; // Limit for India
//     }

//     /**
//      * New rateLimit instance created for each request
//      * Every time a request is made, a new limiter instance is initialized, effectively resetting the rate limit.
//      * limiter = rateLimit({
//             windowMs: 15 * 60 * 1000, // 15 minutes
//             limit: maxRequests,
//             message: 'Too many requests, please try again later.',
//         });

//         limiter(req,res,next)
//     }
//      */

//     // Reuse existing limiter for the country, or create a new one
//     if (!limiters[country]) {
//         limiters[country] = rateLimit({
//             windowMs: 15 * 60 * 1000, // 15 minutes
//             limit: maxRequests,
//             message: 'Too many requests, please try again later.',
//         });
//     }

//     // Apply the correct rate limiter middleware
//     // execute the limiter as middleware to be applied on the current request
//     limiters[country](req, res, next);
// };


const controllerHandler = (app, express) =>{


    // Serve static files
    app.use('/Assets', express.static('Assets'))


    // app.set('trust proxy', 'loopback')
    // app.use(customRateLimiter)
    
    // app.use(helmet({}))
    app.get('/', (req, res) => {

        res.status(200).json({
            message: 'Hello from Social App'
        })
    })

    app.use('/auth', controllers.authRouter)
    app.use('/post', controllers.postController)
    app.use('/user', controllers.userController)
    
    
    app.all('*', 
        (req, res) => res.status(404).json(
            { message: 'Route not found please make sure from your url and your method' }
        )
    )

    // global error handler
    app.use(globalErrorHandler)

}

export default controllerHandler

