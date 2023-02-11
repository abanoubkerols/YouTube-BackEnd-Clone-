
import { videoModel } from "../Models/video.model.js";

//  const ip = request.params.ip
//  ipInfo.getIPInfo(ip).then(data => {
//      console.log(data);
//  }).catch(err => console.log(err));


export const addIP = async (request, response, next) => {
    const ip = request.params.ip



    const filename = request.paramsfilename
    const video = await videoModel.findOne({ filename: filename })

    if (video.views.length === 0) {


        const location_view_data = data.views.maps((ip, idx) => {

            ipInfo.getIPInfo(ip).then(data => {
                const country = data.country

                video.views.push({ country , views:1 })
            }).catch((err) => {
                return {}
            })
        })




        video.views.push(ip)
        videoModel.findOneAndUpdate({ filename: filename }, video, { name: true }, (error, doc) => {
            if (error) {
                return response.status(500).json({ msg: "Network Error " })
            }
            return next()
        })
    } else {
        const idx = video.views.indexOf(ip)

        if (idx === -1) {
            video.views.push(ip)
            videoModel.findOneAndUpdate({ filename: filename }, video, { name: true }, (error, doc) => {
                if (error) {
                    return response.status(500).json({ msg: "Network Error " })
                }
                return next()
            })
            next()
        }
    }
}