import React, { useEffect, useState, Fragment } from 'react';
import Axios from "axios";


const SideVideo = ({}) => {

    const [SideVideo, setSideVideo] = useState([]);

    useEffect(() => {
        Axios.get('/api/video/getVideos')
            .then(response => {
                if (response.data.success) {
                    console.log(response.data.videos);
                    setSideVideo(response.data.videos);
                } else {
                    alert('Failed to get Videos');
                }
            })
    }, []);

    const renderSideVideo = SideVideo.map((video, index) => {

        const minutes = Math.floor(video.duration / 60);
        const seconds = Math.floor(video.duration - minutes * 60);

        return (
            <div key={index} style={{ display: 'flex', marginBottom: '1rem', padding: '0 2rem' }}>
                <div style={{ width: '40%', marginRight: '1rem' }}>
                    <a href style={{  color: 'gray' }}>
                        <img style={{ width: '100%' }} src={`http://localhost:5000/${video.thumbnail}`} alt="thumbnail" />
                    </a>
                </div>

                <div style={{ width: '50%' }}>
                    <a href style={{ color: 'gray' }}>
                        <div style={{ fontSize: '1rem', color: 'black' }}>{video.title}</div>
                        <div>{video.writer.name}</div>
                        <div>{video.views} views</div>
                        <div>{minutes} : {seconds}</div>
                    </a>
                </div>
            </div>
        );
    });

    return (
        <Fragment>
            <div style={{ marginTop: '3rem' }}>{renderSideVideo}</div>
        </Fragment>
    );
};

export default SideVideo;