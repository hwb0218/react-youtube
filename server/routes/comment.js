const express = require('express');
const router = express.Router();
const { Comment } = require('../models/Comment');

router.post('/saveComment', (req, res) => {
    const comment = new Comment(req.body);

    comment.save((err, comment) => {
        if (err) {
            return res.json({ success: false, err });
        }
        // save query 에서는 populate 속성에 접근 할 수 없기 때문에 Comment 모델을 이용한다.
        Comment.find({ '_id': comment._id })
            .populate('writer')
            .exec((err, result) => {
                if (err) {
                    return res.json({ success: false, err });
                }
                return res.status(200).json({ success: true, result });
            });
    });
});

router.post('/getComments', (req, res) => {
    Comment.find({ 'videoId' : req.body.videoId })
        .populate('writer')
        .exec((err, comments) => {
            if (err) {
                return res.status(400).send(err);
            }
            return res.status(200).json({ success: true, comments });
        })
});


module.exports = router;