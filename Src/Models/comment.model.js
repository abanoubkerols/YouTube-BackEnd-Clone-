import { Schema, model } from 'mongoose'

const commentSchema = new Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    comment: {
        type: String,
        require: [true, 'comment is require']
    },

    likes: {
        type: Number,
        default: 0
    },
    dislikes: {
        type: Number,
        default: 0
    },
    replies: [
        {
            type: Schema.Types.ObjectId,
            ref: 'comment'
        }
    ]

})

export const commentModel = model('comment', commentSchema)


