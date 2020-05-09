import React, { useState } from 'react'
import { Comment, Avatar, Button, Input } from 'antd';
import Axios from 'axios';
import { useSelector } from 'react-redux';
import LikeDislikes from './LikeDislikes';
import { useTranslation } from 'react-i18next';
import { message } from 'antd';

const { TextArea } = Input;

function SingleComment(props) {
    const { t } = useTranslation();
    const user = useSelector(state => state.user);
    const [CommentValue, setCommentValue] = useState("")
    const [OpenReply, setOpenReply] = useState(false)

    const handleChange = (e) => {
        setCommentValue(e.currentTarget.value)
    }

    const openReply = () => {
        setOpenReply(!OpenReply)
    }

    function convertHtmlToText(str) {
        str = str.toString();
        return str.replace(/<[^>]*(>|$)|&nbsp;|&zwnj;|&raquo;|&laquo;|&gt;/g, '');
    }

    const onSubmit = (e) => {
        e.preventDefault();

        if (!CommentValue) {
            return message.error(t('movie.replyEmptyCom'));
        }

        const variables = {
            writer: user.userData._id,
            postId: props.postId,
            responseTo: props.comment._id,
            content: convertHtmlToText(CommentValue)
        }


        Axios.post('/api/comment/saveComment', variables)
            .then(response => {
                if (response.data.success) {
                    setCommentValue("")
                    setOpenReply(!OpenReply)
                    props.refreshFunction(response.data.result)
                } else {
                    message.error(t('movie.failCom'))
                }
            })
    }

    const actions = [
        <LikeDislikes comment commentId={props.comment._id} userId={localStorage.getItem('userId')} />,
        <span onClick={openReply} key="comment-basic-reply-to">{t('movie.reply')}</span>
    ]

    return (
        <div>
            <Comment
                actions={actions}
                author={props.comment.writer.username}
                avatar={
                    <Avatar
                        src={props.comment.writer.image}
                        alt="image"
                    />
                }
                content={
                    <p>
                        {props.comment.content}
                    </p>
                }
            ></Comment>


            {OpenReply &&
                <form style={{ display: 'flex' }} onSubmit={onSubmit}>
                    <TextArea
                        style={{ width: '100%', borderRadius: '5px' }}
                        onChange={handleChange}
                        value={CommentValue}
                        placeholder={t('movie.comReply')}
                    />
                    <br />
                    <Button style={{ width: '20%', height: '52px' }} onClick={onSubmit}>{t('movie.comSubmit')}</Button>
                </form>
            }

        </div>
    )
}

export default SingleComment
