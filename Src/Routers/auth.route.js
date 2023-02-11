import {  Router } from "express";
import { AuthController } from '../Controller/auth.controller.js'

const router = Router()
const Controller = new AuthController()

router.post('/api/signup' , (request,response)=>{
    Controller.signUp(request,response)
})

router.post('/api/signin',(request,response)=>{
    Controller.signIn(request,response)
})

router.post('/api/password-reset' , (request,response)=>{
    Controller.forgetPassword(request,response)
})

export default router