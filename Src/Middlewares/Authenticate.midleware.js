import  Jwt  from "jsonwebtoken"


export const Authenticate = (request , response ,next )=>{
    const token = request.headers['x-auth-token']

    Jwt.verify(token,process.env.cookie_secret ,(error , decoded)=>{
        if(error){
            return response.status(400).json({msg : 'SignUp or login to uplaod your video'})
        }

        request.token = decoded 
        next()
    })
}
