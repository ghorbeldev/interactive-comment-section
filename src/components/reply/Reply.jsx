import React, { useEffect, useRef, useState } from 'react';
import data from '../../config/data.json';
import './reply.scss';
import useLocalStorage from '../hooks/useLocalStorage';
const Reply = ({ commentId, isOpen, comment, closeReply, isReply }) => {
	const textareaRef = useRef(null);
	useEffect(() => {
		if (isOpen && !comment) textareaRef.current.focus();
	}, [textareaRef, isOpen, comment]);

	const [storedValue, setStoredValue] = useLocalStorage('comments');
	let replyingTo;
	if (isReply) {
		storedValue.forEach(comment => {
			if (comment.replies.length) {
				let reply = comment.replies.find(reply => reply.id === commentId);
				replyingTo = reply
					? reply?.hasOwnProperty('user')
						? reply.user.username
						: ''
					: replyingTo;
			}
		});
	} else if (!isReply && !comment) {
		replyingTo = storedValue.find(comment => comment.id === commentId).user
			.username;
	}
	const initialTextareaValue = comment ? '' : `@${replyingTo} `;
	const [textareaValue, setTextareaValue] = useState(initialTextareaValue);
	const handleTextareaChange = e => {
		setTextareaValue(e.target.value);
	};
	const addComment = () => {
		if (textareaValue) {
			const comment = {
				id: new Date().getTime().toString(16),
				content: textareaValue,
				createdAt: '1 seconds ago',
				score: 0,
				user: data.currentUser,
				replies: [],
			};
			setStoredValue(prevState => [...prevState, comment]);
		}
	};
	const addReply = () => {
		if (textareaValue) {
			setStoredValue(prevState => {
				let value = [...prevState];
				let searchedComment = value.find(comment =>
					isReply
						? comment.replies.find(reply => reply.id === commentId)
						: comment.id === commentId
				);
				const reply = {
					id: new Date().getTime().toString(16),
					content: `${textareaValue}`,
					createdAt: '1 seconds ago',
					score: 0,
					user: data.currentUser,
					replyingTo: searchedComment.user.username,
				};
				searchedComment.replies.push(reply);
				return value;
			});
			closeReply();
		}
	};
	return (
		<div className={`reply-box ${!isOpen ? 'close' : null}`}>
			<img src={data.currentUser.image.webp} alt={data.currentUser.username} />
			<textarea
				placeholder='Add a comment...'
				value={textareaValue}
				onChange={handleTextareaChange}
				ref={textareaRef}
			></textarea>
			<button onClick={comment ? addComment : addReply}>REPLY</button>
		</div>
	);
};

export default Reply;
