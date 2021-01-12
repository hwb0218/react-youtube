import React, {useState} from 'react';
import { Comment, Avatar, Button, Input } from 'antd';
import Axios from "axios";
import { useSelector } from "react-redux";

const { TextArea } = Input;

const SingleComment = ({ videoId }) => {
    const user = useSelector(state => state.user);
    const [commentValue, setCommentValue] = useState('');
    const [openReply, setOpenReply] = useState(false);

    const onClickReplyOpen = () => {
        setOpenReply(!openReply);
    }

    const actions = [
        <span onClick={onClickReplyOpen} key="comment-basic-reply-to">Reply to</span>
    ]

    const onSubmit = (e) => {
        e.preventDefault();

        const variables = {
            content: commentValue,
            writer: user.userData._id,
            videoId,
            responseTo
        };

        Axios.post('/api/comment/saveComment', variables)
            .then(response => {
                response.data.success ? console.log(response.data.result) : alert('코멘트를 저장하지 못했습니다.');
            });
    };

    const handleChange = (e) => {
        setCommentValue(e.currentTarget.value);
    }

    return (
        <div>
            <Comment
                actions={actions}
                author
                avatar={<Avatar src alt />}
                content
            />

            {openReply &&
                <form style={{ display: 'flex' }} onSubmit={onSubmit}>
                    <TextArea
                        style={{ width: '100%', borderRadius: '5px' }}
                        onChange={handleChange}
                        value={commentValue}
                        placeholder="코멘트를 작성해주세요"
                    />
                    <br/>
                    <Button style={{ width: '20%', height: '52px' }} onClick={onSubmit}>Submit</Button>
                </form>
            }
        </div>
    );
};

export default SingleComment;