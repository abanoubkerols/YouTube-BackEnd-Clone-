import {Schema , model} from 'mongoose'


const userSchema = new Schema ({
    userName :{
        type:String,
        require:[true , 'UserName is Required To Create Account '],
        unique:[true , "Account With This userName already exist"]
    },
    email :{
        type :String,
        require:[true , "Email is required To Created account"],
        unique:[true , 'account with this email already exist']

    },
    password :{
        type:String,
        require:[true,'password is required to create email'],
        minlength : 6
    },
    videos: [
        {
            type:Schema.Types.ObjectId,
            ref:'videos'
        }
    ],
    //people subscribe to channel
    subscribers:{
        type:Array,
        default:[]
    },
    // channel itself that user subscribe it 
    userSubscribedChannel :{
        type:Array,
        default:[]
    }
})



export const userModel = model('user' , userSchema)