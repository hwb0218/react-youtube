const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const ffmpeg = require("fluent-ffmpeg");
const { Video } = require("../models/Video");
const { Subscriber } = require('../models/Subscriber');

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    },
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname);

        if (ext !== ".mp4") {
            return cb(res.status(400).end("only jpg, png, mp4 is allowed"), false);
        }
        cb(null, true);
    },
});

const upload = multer({ storage: storage }).single("file");

//=================================

//             video

//=================================

router.post("/uploadfiles", (req, res) => {
    // 비디오를 서버에 저장
    upload(req, res, (err) => {
        if (err){
            return res.json({ success: false, err });
        }
        return res.json({ success: true, url: res.req.file.path, fileName: res.req.file });
    });
});

router.post("/uploadVideo", (req ,res) => {
    const video = new Video(req.body);

    video.save((err, doc) => {
        if (err) {
            return res.json({ success: false, err });
        }
        return res.status(200).json({ success: true });
    });
});

router.get("/getVideos", (req ,res) => {
    Video.find()
        .populate('writer')
        .exec((err, videos) => {
            if (err) {
                return res.status(400).send(err);
            }
            return res.status(200).json({ success: true, videos });
        })
});

router.post("/getVideoDetail", (req, res) => {
    Video.findOne({ "_id": req.body.videoId })
        .populate('writer')
        .exec((err, videoDetail) => {
            if (err) {
                return res.status(400).send(err);
            }
            return res.status(200).json({ success: true, videoDetail })
        });
});

router.post("/thumbnail", (req, res) => {
    // 썸네일을 생성하고 비디오 러닝타임 가져오기
    let thumbsFilePath ="";
    let fileDuration ="";
    // 비디오 정보 가져오기
    ffmpeg.ffprobe(req.body.url, function(err, metadata){
        console.dir('metadata.....',metadata);
        console.log(metadata.format.duration);

        fileDuration = metadata.format.duration;
    })
    // 썸네일 생성
    ffmpeg(req.body.url)
        .on('filenames', function (filenames) {
            console.log('Will generate ' + filenames.join(', '))
            thumbsFilePath = "uploads/thumbnails/" + filenames[0];
        })
        .on('end', function () {
            console.log('Screenshots taken');
            return res.json({ success: true, url: thumbsFilePath, fileDuration: fileDuration })
        })
        .screenshots({
            // Will take screens at 20%, 40%, 60% and 80% of the video
            count: 3,
            folder: 'uploads/thumbnails',
            size:'320x240',
            // %b input basename ( filename w/o extension )
            filename:'thumbnail-%b.png'
        });
});

router.post("/getSubscriptionVideos", (req ,res) => {
    // 자신의 아이디를 가지고 구독중인 아이디를 찾는다.
    Subscriber.find({ userFrom: req.body.userFrom })
        .exec((err, subscriberInfo) => {
            if (err) {
                return res.status(400).send(err);
            }
            const subscribedUser = [];
            subscriberInfo.map((subscriber, i) => {
                subscribedUser.push(subscriber.userTo);
            });

            // 구독중인 아이디의 비디오 정보를 가져온다.
            // _id 를 가져올때 일반적으로 req.body._id 하면 안됨 가져와야 할 아이디(subscribedUser array)가 여러개이기 때문
            Video.find({ writer : { $in: subscribedUser} })
                .populate('writer')
                .exec((err, videos) => {
                    if (err) {
                        return res.status(400).send(err);
                    }
                    return res.status(200).json({ success : true, videos });
                });
        });
});


module.exports = router;
