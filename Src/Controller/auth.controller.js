import { hash, compare, genSalt } from "bcrypt";
import jwt from "jsonwebtoken"
import formidable from "formidable"
import { userModel } from '../Models/user.model.js'


export class AuthController {
    // SignUp Method
    signUp(request, response) {
        const form = new formidable.IncomingForm()
        form.parse(request, async (error, fields, files) => {
            if (error) {
                return response.status(500).json({ msg: "Network Error : Try Later" })
            }

            const { userName, email, password } = fields
            const salt = await genSalt(15)
            const hashPassword = await hash(password, salt)
            const newAccount = new userModel({
                userName,
                email,
                password: hashPassword
            })

            try {
                const saveAccount = await newAccount.save()
                return response.status(201).json({ msg: " your Account Created Successfully " })
            } catch (error) {
                
                return response.status(500).json({ msg: "failed To create Account"})
            }

        })
    }


    // signIn Method
    signIn(request, response) {
        const form = new formidable.IncomingForm()

        form.parse(request, async (error, fields, files) => {
            if (error) {
                return response.status(500).json({ msg: "NetWork Failed " })
            }
            const { account, password } = fields

            const isAccountEmail = account.includes('@')

            if (isAccountEmail) {
                const user = await userModel.findOne({ email: account })

                if (!user) {
                    return response.status(404).json({ msg: " Account With this Email Does not Exist" })
                }
                const isPasswordValid = await compare(password, user.password)
                if (!isPasswordValid) {
                    return response.status(400).json({ msg: "Invalid Credentials" })
                }
                const Token_payload = {
                    _id: user._id,
                    email: user.email,
                    userName: user.userName
                }
                const token = jwt.sign(Token_payload, process.env.cookie_secret, { expiresIn: "365d" })
                return response.status(200).json({ token })
            }
        })
    }

    // Forgot Password Method
    forgetPassword(request, response) {

        const form = new formidable.IncomingForm()

        form.parse(request, async (error, fields, files) => {
            if (error) {
                return response.status(500).json({ msg: "NetWork Error : Faild To Reset password" })
            }
            const { email, password } = fields

            if (!email || !password) {
                return response.status(400).json({ msg: "all Fields are Require to reset password " })
            }
            const salt = await genSalt(15)
            const hashPassword = await hash(password, salt)

            try {

                // todo error
                const user = await userModel.findOne({ email: email })
                if (!user) {
                    return response.status(404).json({ msg: "Account With this Email does not Exist" })
                }
                const updatedAccount = await userModel.findOneAndUpdate({ email: email }, { $set: { password: hashPassword } }, { new: true })
                return response.status(200).json({ msg: "password reset success" , updatedAccount})


            } catch (error) {
                return response.status(500).json({ msg: "faild to reset password" })

            }
        })

    }
}
