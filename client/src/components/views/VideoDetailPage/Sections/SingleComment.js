import React, {useState} from 'react';
import { Comment, Avatar, Button, Input } from 'antd';
import Axios from "axios";
import { useSelector } from "react-redux";

const { TextArea } = Input;

const SingleComment = ({ videoId, comment, refreshFunction }) => {
    console.log(comment);
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
            responseTo: comment._id
        };

        Axios.post('/api/comment/saveComment', variables)
            .then(response => {
                if (response.data.success) {
                    refreshFunction(response.data.result);
                    setCommentValue("");
                    setOpenReply(false);
                } else {
                    alert("코멘트 정보를 가져올 수 없습니다.");
                }
            });
    };

    const handleChange = (e) => {
        setCommentValue(e.currentTarget.value);
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            onSubmit(e);
        }
    }

    return (
        <div>
            <Comment
                actions={actions}
                author={comment.writer.name}
                avatar={<Avatar src={comment.writer.image} alt="avatar" />}
                content={<p>{comment.content}</p>}
            />

            {openReply &&
                <form style={{ display: 'flex' }} onKeyPress={handleKeyPress}>
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