import React, {Fragment, useEffect, useState} from 'react';
import SingleComment from "./SingleComment";

const ReplyComment = ({ refreshFunction, commentLists, parentCommentId, videoId }) => {

    const [childCommentNumber, setChildCommentNumber] = useState(0);
    const [openReplyComments, setOpenReplyComments] = useState(false);

    useEffect(() => {
        let commentNumber = 0;
        commentLists.map((comment) => {
            if (comment.responseTo === parentCommentId) {
                commentNumber++;
            }
        });
        setChildCommentNumber(commentNumber);
    }, [commentLists]);

    const renderReplyComment = () => (
        commentLists.map((comment, index) => (
            <Fragment>
                {
                    comment.responseTo === parentCommentId &&
                        <div>
                            <SingleComment refreshFunction={refreshFunction} comment={comment} videoId={videoId} />
                            <ReplyComment refreshFunction={refreshFunction} parentCommentId={comment._id} commentLists={commentLists} videoId={videoId} />
                        </div>
                }
            </Fragment>
        ))
    );

    const onHandleChange = () => {
        setOpenReplyComments(!openReplyComments);
    }

    return (
        <div>
            {childCommentNumber > 0 &&
                <p style={{ fontSize: '14px', margin: 0, color: 'gray', cursor: 'pointer' }} onClick={onHandleChange}>
                    {!openReplyComments ? <span>답글 {childCommentNumber}개</span> : <span>답글 숨기기</span>} 
                </p>
            }

            {openReplyComments && renderReplyComment(parentCommentId)}
        </div>
    );
};

export default ReplyComment;