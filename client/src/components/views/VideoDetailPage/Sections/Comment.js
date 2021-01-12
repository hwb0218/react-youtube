import React, { useState } from 'react';
import Axios from "axios";
import { useSelector } from 'react-redux';
import SingleComment from "./SingleComment";

const Comment = ({ videoId }) => {
    const user = useSelector(state => state.user);
    const [commentValue, setCommentValue] = useState('');

    const handleChange = (e) => {
        setCommentValue(e.currentTarget.value);
    }

    const onSubmit = (e) => {

        const variables = {
            content: commentValue,
            writer: user.userData._id,
            videoId
        };

        e.preventDefault();
        Axios.post('/api/comment/saveComment', variables)
            .then(response => {
                response.data.success ? console.log(response.data.result) : alert('코멘트를 저장하지 못했습니다.');
            });
    }

    return (
        <div>
            <br/>
            <p>Replies</p>
            <hr/>

            {/*Comment Lists*/}
            <SingleComment videoId={videoId} />
            {/*Root Comment Form*/}
            <form style={{ display: 'flex' }} onSubmit={onSubmit}>
                <textarea style={{ width: '100%', borderRadius: '5px' }}
                    onChange={handleChange}
                    value={commentValue}
                    placeholder="코멘트를 작성해 주세요"
                />
                <br/>
                <button style={{ width: '20%', height: '52px' }} onClick={onSubmit}>Submit</button>
            </form>
        </div>
    );
};

export default Comment;