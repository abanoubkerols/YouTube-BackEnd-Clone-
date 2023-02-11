import {  Router } from "express";
import { Authenticate } from "../Middlewares/Authenticate.midleware.js";
import { videoUpload } from "../Middlewares/Video.middleware.js";
import { VideoController } from "../Controller/Video.controller.js";
import { addIP } from "../Middlewares/ip.middleware.js";

const router = Router()
const Controller = new VideoController()

router.post('/api/video', Authenticate, videoUpload.single('video'), (request, response) => {
    Controller.upload(request, response)
})

router.get('/api/video/:filename/:ip', addIP,(request, response) => {
    Controller.stream(request, response)
})


router.patch('/api/video', (request, response) => {
    Controller.update(request, response)
})

router.delete('/api/video/:video_id/:video_path', (request, response) => {
    Controller.delete(request, response)
})


router.get('/api/video-like/:id', (request, response) => {
    Controller.like(request, response)
})


router.get('/api/video-dislike/:id', (request, response) => {
    Controller.dislike(request, response)
})



router.post('/api/video-comment',Authenticate ,(request, response) => {
    Controller.comment(request, response)
})

router.post('/api/video-reply',Authenticate ,(request, response) => {
    Controller.replyComment(request, response)
})


router.get('/api/video-details/:id' ,(request, response) => {
    Controller.getVideo(request, response)
})

router.get('/api/video-view-count/:id' ,(request, response) => {
    Controller.getViewByLocataion(request, response)
})

export default router 