const express = require('express');
const router = express.Router();

const { Like } = require('../models/Like');
const { Dislike } = require('../models/Dislike');


router.post('/getLikes', (req, res) => {
    let variables = {};
    req.body.videoId ? variables = { videoId: req.body.videoId } : variables = { commentId: req.body.commentId }

    Like.find(variables)
        .exec((err, likes) => {
            if (err) {
                return res.status(400).send(err);
            }
            return res.status(200).json({ success: true, likes });
        });
});

router.post('/getDislikes', (req, res) => {
    let variables = {};
    req.body.videoId ? variables = { videoId: req.body.videoId } : variables = { commentId: req.body.commentId }

    Dislike.find(variables)
        .exec((err, dislikes) => {
            if (err) {
                return res.status(400).send(err);
            }
            return res.status(200).json({ success: true, dislikes });
        });
});

router.post('/upLike', (req, res) => {
    let variables = {};
    req.body.videoId ? variables = { videoId: req.body.videoId, userId: req.body.userId } : variables = { commentId: req.body.commentId, userId: req.body.userId }

    const like = new Like(variables);
    like.save((err, likeResult) => {
        if (err) {
            return res.json({ success: false, err });
        }
        Dislike.findOneAndDelete(variables)
            .exec((err, dislikeResult) => {
               if (err) {
                   return res.status(400).json({ success: false, err });
               }
               return res.status(200).json({ success: true });
            });
    });
});


router.post('/unLike', (req, res) => {
    let variables = {};
    req.body.videoId ? variables = { videoId: req.body.videoId, userId: req.body.userId } : variables = { commentId: req.body.commentId, userId: req.body.userId }

    Like.findOneAndDelete(variables)
        .exec((err, result) => {
            if (err) {
                return res.status(400).json({ success: false, err });
            }
            return res.status(200).json({ success: true });
        });
});

router.post('/upDislike', (req, res) => {
    let variables = {};
    req.body.videoId ? variables = { videoId: req.body.videoId, userId: req.body.userId } : variables = { commentId: req.body.commentId, userId: req.body.userId }

    const dislike = new Dislike(variables);
    dislike.save((err, dislikeResult) => {
        if (err) {
            return res.json({ success: false, err });
        }
        Like.findOneAndDelete(variables)
            .exec((err, likeResult) => {
                if (err) {
                    return res.status(400).json({ success: false, err });
                }
                return res.status(200).json({ success: true });
            });
    });
});

router.post('/unDislike', (req, res) => {
    let variables = {};
    req.body.videoId ? variables = { videoId: req.body.videoId, userId: req.body.userId } : variables = { commentId: req.body.commentId, userId: req.body.userId }

    Dislike.findOneAndDelete(variables)
        .exec((err, result) => {
            if (err) {
                return res.status(400).json({ success: false, err });
            }
            return res.status(200).json({ success: true });
        });
});

module.exports = router;