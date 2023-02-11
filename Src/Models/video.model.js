import { Schema, model } from 'mongoose'

const videoSchema = new Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    name: {
        type: String,
        required: [true, 'Video name is required To Upload video ']
    },
    videoPath: {
        type: String,
        required: [true, 'Video path is required to upload Video'],
        unique: [true, 'video path is aleardy exist']
    },
    likes: {
        type: Number,
        default: 0
    },
    dislikes: {
        type: Number,
        default: 0
    },
    views: {
        type: Array,
        default: []
    }
    , comments: [
        {
            type: Schema.Types.ObjectId,
            ref: 'comment'
        }
    ]


})

export const videoModel = model('video', videoSchema)