

import  { Router} from 'express'
import * as AuthServices from './Services/authentication.service.js'
import { errorHandler } from '../../Middleware/error-handler.middleware.js'

const authRouter = Router()

authRouter.post('/signup', errorHandler(AuthServices.SignUpService))
authRouter.put('/confirm-email', errorHandler(AuthServices.ConfirmEmailService))
authRouter.post('/login', errorHandler(AuthServices.SignInService))
// authRouter.post('/logout', AuthServices.logOutService)
// authRouter.get('/verify-email/:token', AuthServices.verifyEmailService)
// authRouter.post('/refresh-token', AuthServices.refreshTokenService)
// authRouter.patch('/forget-password', AuthServices.forgetPasswordService)
// authRouter.put('/reset-password', AuthServices.resetPasswordService)


authRouter.post('/gmail-login', errorHandler(AuthServices.GmailLoginService))
authRouter.post('/gmail-signup', errorHandler(AuthServices.GmailRegisterService))

export  {authRouter}
