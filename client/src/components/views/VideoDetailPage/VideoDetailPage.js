import React, { useEffect, useState, Fragment } from 'react';
import { Row, Col, List, Avatar } from 'antd';
import Axios from "axios";
import SideVideo from "./Sections/SideVideo";
import Subscribe from "./Sections/Subscribe";
import Comment from "./Sections/Comment";
import './VideoDetailPage.css';

const VideoDetailPage = ({ match }) => {

    const videoId = match.params.videoId;

    const variables = { videoId };

    const [VideoDetail, setVideoDetail] = useState([]);
    const [comments, setComments] = useState([]);

    useEffect(() => {
        Axios.post('/api/video/getVideoDetail', variables)
            .then(response => {
                if (response.data.success) {
                    setVideoDetail(response.data.videoDetail);
                    console.log(response.data.videoDetail);
                } else {
                    alert("비디오 정보를 가져올 수 없습니다.");
                }
            });

        Axios.post('/api/comment/getComments', variables)
            .then(response => {
                if (response.data.success) {
                    setComments(response.data.comments);
                    console.log(response.data.comments);
                } else {
                    alert("코멘트 정보를 가져올 수 없습니다.");
                }
            });
    }, []);

    const updateComment = (newComment) => {
        setComments(comments.concat(newComment));
    }

    if (VideoDetail.writer) {
        const subscribeButton = VideoDetail.writer._id !== localStorage.getItem('userId') && <Subscribe userTo={VideoDetail.writer._id} userFrom={localStorage.getItem('userId')} />
        return (
            <Row gutter={[16, 16]}>
                <Col lg={18} xs={24}>
                    <div style={{ width: '100%', padding: '3rem 4rem' }}>
                        <video style={{ width: '100%' }} src={`http://localhost:5000/${VideoDetail.filePath}`} controls />

                        <List.Item actions={[subscribeButton]}>
                            <List.Item.Meta
                                avatar={<Avatar src={VideoDetail.writer.image} />}
                                title={VideoDetail.writer.name}
                                description={VideoDetail.description}
                            />
                        </List.Item>

                        {/*comments*/}
                        <Comment refreshFunction={updateComment} commentLists={comments} videoId={videoId} />
                    </div>
                </Col>
                <Col lg={6} xs={24}>
                    <SideVideo videoId={videoId} />
                </Col>
            </Row>
        );
    } else {
        return (
            <div>...loading</div>
        )
    }
};

export default VideoDetailPage;