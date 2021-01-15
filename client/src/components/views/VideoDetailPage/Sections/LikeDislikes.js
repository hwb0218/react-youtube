import React, {useEffect, useState} from 'react';
import { Tooltip, Icon } from 'antd';
import Axios from "axios";

const LikeDislikes = ({ video, userId, videoId, commentId }) => {

    const [likes, setLikes] = useState(0);
    const [dislikes, setDislikes] = useState(0);
    const [likeAction, setLikeAction] = useState(null);
    const [dislikeAction, setDislikeAction] = useState(null);

    let variables = {};
    video ? variables = { videoId, userId } : variables = { commentId, userId };

    useEffect(() => {
        Axios.post(`/api/like/getLikes`, variables)
            .then(response => {
                if (response.data.success) {
                    console.log(response.data);
                    setLikes(response.data.likes.length);
                    response.data.likes.map((like) => {
                        if (like.userId === userId) {
                            setLikeAction('liked');
                        }
                    });
                }  else {
                    alert(`좋아요 정보를 가져오는데 실패했습니다.`);
                }
            });

        Axios.post(`/api/like/getDislikes`, variables)
            .then(response => {
                if (response.data.success) {
                    console.log(response.data);
                    setDislikes(response.data.dislikes.length);
                    response.data.dislikes.map((dislike) => {
                        if (dislike.userId === userId) {
                            setDislikeAction('disliked');
                        }
                    });
                }  else {
                    alert(`싫어요 정보를 가져오는데 실패했습니다.`);
                }
            });
    }, []);

    const onLike = () => {
        if (likeAction === null) {
            Axios.post('/api/like/upLike', variables)
                .then(response => {
                    if (response.data.success) {
                        setLikes(likes + 1);
                        setLikeAction('liked');

                        if(dislikeAction !== null) {
                            setDislikeAction(null);
                            setDislikes(dislikes - 1);
                        }
                    } else {
                        alert('Like를 올리지 못했습니다.');
                    }
                });
        } else {
            Axios.post('/api/like/unLike', variables)
                .then(response => {
                    if (response.data.success) {
                        setLikes(likes - 1);
                        setLikeAction(null);
                    } else {
                        alert('Like를 내리지 못했습니다.');
                    }
                });

        }
    }

    const onDislike = () => {
        if (dislikeAction === null) {
            Axios.post('/api/like/upDislike', variables)
                .then(response => {
                    if (response.data.success) {
                        setDislikes(dislikes + 1);
                        setDislikeAction('disliked');

                        if (likeAction !== null) {
                            setLikeAction(null);
                            setLikes(likes - 1);
                        }
                    } else {
                        alert('dislike를 올리지 못했습니다.');
                    }
                });
        } else {
            Axios.post('/api/like/unDislike', variables)
                .then(response => {
                    if (response.data.success) {
                        setDislikes(dislikes - 1);
                        setDislikeAction(null);
                    } else {
                        alert('dislike를 내리지 못했습니다.');
                    }
                });
        }
    }

    return (
        <div>
            <span key='comment-basic-like'>
                <Tooltip title="Like">
                    <Icon type="like" theme={likeAction === 'liked' ? 'filled' : 'outlined'} onClick={onLike} />
                </Tooltip>
                <span style={{ paddingLeft: '8px', cursor: 'auto' }}> {likes} </span>
            </span>

            <span key='comment-basic-dislike'>
                <Tooltip title="Dislike">
                    <Icon type="dislike" theme={dislikeAction === 'disliked' ? 'filled' : 'outlined'} onClick={onDislike}/>
                </Tooltip>
                <span style={{ paddingLeft: '8px', paddingRight: '8px', cursor: 'auto' }}> {dislikes} </span>
            </span>
        </div>
    );
};

export default LikeDislikes;