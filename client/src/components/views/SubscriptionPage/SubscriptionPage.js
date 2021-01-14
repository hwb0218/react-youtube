import React, {useEffect, useState} from 'react'
import { Typography, Icon, Card, Avatar, Col, Row } from 'antd';
import Axios from "axios";
import { FaCode } from "react-icons/fa";
import moment from "moment";
import '../LandingPage/LandingPage.css';

const { Title } = Typography;
const { Meta } = Card;

const SubscriptionPage = () => {

    const [Videos, setVideos] = useState([]);

    const subscriptionVariables = { userFrom : localStorage.getItem("userId") };

    useEffect(() => {
        Axios.post('/api/video/getSubscriptionVideos', subscriptionVariables)
            .then(response => {
                if (response.data.success) {
                    console.log(response.data);
                    setVideos(response.data.videos);
                } else {
                    alert('비디오를 가져오는데 실패했습니다.');
                }
            })
    }, []);

    const renderCards = Videos.map((video, index) => {

        const minutes = Math.floor(video.duration / 60);
        const seconds = Math.floor(video.duration - minutes * 60);

        return (
            <Col lg={6} md={8} xs={24} key={index}>
                <div style={{ position: 'relative'}}>
                    <a href={`/video/${video._id}`}>
                        <img style={{ width: '100%' }} src={`http://localhost:5000/${video.thumbnail}`} alt="thumbnail"/>
                        <div className="duration">
                            <span>{minutes} : {seconds}</span>
                        </div>
                    </a>
                </div>
                <br/>

                <Meta
                    avatar={<Avatar src={video.writer.image} />}
                    title={video.title}
                    description=""
                />
                <span>{video.writer.name}</span>
                <br/>
                <span style={{ marginLeft: '3rem'}}>{video.views} views</span> - <span>{moment(video.createdAt).format("MMM Do YY")}</span>
            </Col>
        )
    });

    return (
        <div style={{ width: '85%', margin: '3rem auto' }}>
            <Title level={2}> Subscribed Videos </Title>
            <hr/>
            <Row gutter={16}>
                {renderCards}
            </Row>
        </div>
    )
};

export default SubscriptionPage;