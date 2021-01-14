import React, { useState, Fragment } from 'react';
import { Button, Input } from 'antd';
import Axios from "axios";
import { useSelector } from 'react-redux';
import SingleComment from "./SingleComment";
import ReplyComment from "./ReplyComment";

const { TextArea } = Input;

const Comment = ({ videoId, commentLists, refreshFunction }) => {
    const user = useSelector(state => state.user);
    const [commentValue, setCommentValue] = useState('');

    const handleChange = (e) => {
        setCommentValue(e.currentTarget.value);
    }

    const onSubmit = (e) => {
        e.preventDefault();

        const variables = {
            content: commentValue,
            writer: user.userData._id,
            videoId
        };

        Axios.post('/api/comment/saveComment', variables)
            .then(response => {
                if (response.data.success) {
                    refreshFunction(response.data.result);
                    setCommentValue("");
                } else {
                    alert("코멘트 정보를 가져올 수 없습니다.");
                }
            });
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            onSubmit(e);
        }
    }

    return (
        <div>
            <br/>
            <p>Replies</p>
            <hr/>

            {/*Comment Lists*/}
            {commentLists && commentLists.map((comment, index) => (
                (!comment.responseTo &&
                    <Fragment>
                    <SingleComment refreshFunction={refreshFunction} comment={comment} videoId={videoId} />
                    <ReplyComment refreshFunction={refreshFunction} parentCommentId={comment._id} commentLists={commentLists} videoId={videoId} />
                    </Fragment>
                )
            ))}


            {/*Root Comment Form*/}
            <form style={{ display: 'flex' }} onKeyPress={handleKeyPress}>
                <TextArea
                    style={{ width: '100%', borderRadius: '5px' }}
                    onChange={handleChange}
                    value={commentValue}
                    placeholder="코멘트를 작성해 주세요"
                />
                <br/>
                <Button style={{ width: '20%', height: '52px' }} onClick={onSubmit}>Submit</Button>
            </form>
        </div>
    );
};

export default Comment;