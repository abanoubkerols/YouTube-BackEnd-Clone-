import { videoModel } from "../Models/video.model.js"
import { userModel } from '../Models/user.model.js'
import { commentModel } from '../Models/comment.model.js'
import fs from 'fs'
import formidable from "formidable"
import { IpInfo } from 'ip-info-finder'


export class VideoController {
    async upload(request, response) {
        const newVideo = new videoModel({
            owner: request.token._id,
            name: request.body.name,
            videoPath: request.filename
        })
        try {
            const saveVideo = await newVideo.save()
            return response.status(201).json({ msg: 'Authenticated Video Uploaded successfully' })
        } catch (error) {
            return response.status(500).json({ msg: 'Video upload failed' })
        }


    }

    stream(request, response) {
        const range = request.headers.range

        if (!range) {
            return response.status(400).json({ msg: 'Range header is required to start stream' })
        }

        const videoPath = `videos/${request.params.filename}`
        const videoSize = fs.statSync(videoPath).size

        const start = Number(range.replace(/\D/g, ""))

        const chunk_size = 10 ** 6
        const end = Math.min(start + chunk_size, videoSize - 1)

        const contentLength = end - start + 1

        const headers = {
            'Conrent-Length': contentLength,
            'Accept-Range': 'bytes',
            'Content-Type': 'video/mp40',
            'Content-Range': `bytes ${start}-${end}/${videoSize}`
        }

        response.writeHead(206, headers)

        const videoStream = fs.createReadStream(videoPath, { start, end })
        videoStream.pipe(response)
    }

    update(request, response) {
        const form = new formidable.IncomingForm()
        form.parse(request, (error, fidlds, files) => {
            if (error) {
                return response.status(500).json({ msg: 'NetWork Error : Failed to Update Video name' })
            }

            const { name, id } = fidlds

            if (!name) {
                return response.status(400).json({ msg: 'Video name is required to update name of video' })
            }
            videoModel.findOneAndUpdate({ _id: id }, { $set: { name: name } }, { name: true }, (error, doc) => {
                if (error) {
                    return response.status(500).json({ msg: 'Network Error : Failed to update video name' })
                }

                response.status(200).json({ msg: 'Video name updated successfully' })

            })
        })

    }

    delete(request, response) {
        const video_id = request.params.video_id
        const video_path = request.params.video_path

        const videoPath = `videos/${video_path}`

        if (fs.existsSync(videoPath)) {
            fs.unlink(videoPath, (error) => {
                if (error) {
                    return response.status(500).json({ msg: 'NetWork Error : Faild to delete video' })
                }
                videoModel.findOneAndDelete({ _id: video_id }, (error) => {
                    if (error) {
                        return response.status(500).json({ msg: "NetWork Error : Faild to delete video " })
                    }
                })
                return response.status(200).json({ msg: 'Video deleted' })
            })
        }


    }

    like(request, response) {
        const video_id = request.params.id
        videoModel.findByIdAndUpdate({ _id: video_id }, { $inc: { likes: 1 } }, { new: true }, (error) => {
            if (error) {
                return response.status(500).json({ msg: "Network Error : Failed To like video" })
            }

            return response.status(200).json({ msg: 'Video liked' })
        })
    }

    dislike(request, response) {
        const video_id = request.params.id
        videoModel.findByIdAndUpdate({ _id: video_id }, { $inc: { dislikes: 1 } }, { new: true }, (error) => {
            if (error) {
                return response.status(500).json({ msg: "Network Error : Failed To like video" })
            }

            return response.status(200).json({ msg: 'Video dislike' })
        })
    }

    async comment(request, response) {
        const token = request.token

        const user = await userModel.findOne({ _id: token._id })

        const form = new formidable.IncomingForm()

        form.parse(request, async (error, fields, files) => {
            if (error) {
                return response.status(500).json({ msg: 'network error  : faild to comment on video' })
            }

            const { comment, video_id } = fields

            if (!comment || !video_id) {
                return response.status(400).json({ msg: 'All fields are requird to create a comment' })
            }

            const newComment = new commentModel({
                owner: token._id,
                comment
            })

            const savedComment = await newComment.save()

            videoModel.findOneAndUpdate({ _id: video_id }, { $push: { comments: savedComment._id } }, { new: true }, (error, doc) => {
                if (error) {
                    return response.status(500).json({ msg: "network error  : faild to comment on video" })
                }

                return response.status(200).json({ msg: "Comment is made Successfully" })

            })
        })
    }

    replyComment(request, response) {
        const token = request.token
        const form = new formidable.IncomingForm()

        form.parse(request, async (error, fields, files) => {
            if (error) {
                return response.status(500).json({ msg: 'network error  : Faild to reply on comment' })
            }

            const { comment, comment_id } = fields

            if (!comment || !comment_id) {
                return response.status(400).json({ msg: 'All fields are requird' })
            }

            const newComment = new commentModel({
                owner: token._id,
                comment
            })

            const savedComment = await newComment.save()

            commentModel.findByIdAndUpdate({ _id: comment_id }, { $push: { replies: savedComment._id } }, { new: true }, (error) => {
                if (error) {
                    return response.status(500).json({ msg: 'network error  : Faild to reply on comment' })

                }

                return response.status(200).json({ msg: ' reply on comment made Successfully' })

            })
        })

    }

    async getVideo(request, response) {
        const video_id = request.params.id

        const data = await videoModel.findOne({ _id: video_id }).populate({
            path: 'comments',
            populate: {
                path: 'replies',
                model: 'comment'
            }
        })
        return response.status(200).json(data)



    }

    async getViewByLocataion(request, response) {
        const id = request.params.id
        const data = await videoModel.findOne({ _id: id })

        const location_view_data = data.views.maps((ip, idx) => {

            IpInfo.getIPInfo(ip).then(data => {
                return data
            }).catch((err) => {
                return {}
            })
        })

        const total_view = data.views.length
        const results = {
            total_views: total_view
        }

        return response.status(200).json(results)

    }
}