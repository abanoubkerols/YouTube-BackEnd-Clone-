import { Schema, model } from 'mongoose'

const playlistSchema = new Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    videos:[
        {
            type:Schema.Types.ObjectId,
            ref:'video'
        }
    ],
    playlistname:{
        type:String,
        required:[true,"it is playlist name required"]

    }
   
     


})

export const playlistModel = model('playlist', playlistSchema)