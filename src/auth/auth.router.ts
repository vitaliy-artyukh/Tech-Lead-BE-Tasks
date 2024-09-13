import { Router } from 'express'
import { AuthController } from './auth.controller'
import { loginValidation } from '../middlewares/login-validation.middleware'
import { registerValidation } from '../middlewares/register-validation.middleware'

class AuthRouter {
    private router = Router()

    constructor(private authController: AuthController) {
        this.initRouters()
    }

    private initRouters() {
        this.router.post('/login', loginValidation, this.authController.login)
        this.router.post(
            '/register',
            registerValidation,
            this.authController.register,
        )
        this.router.get('/session/:sessionId', this.authController.session)
        this.router.delete('/logout', this.authController.logout)
    }

    public getRouter() {
        return this.router
    }
}

export default new AuthRouter(new AuthController()).getRouter()
