import React, { useRef, useState } from 'react';
import './comment.scss';
import { FaReply } from 'react-icons/fa';
import { AiFillDelete } from 'react-icons/ai';
import { MdModeEdit } from 'react-icons/md';
import Reply from '../reply/Reply';
import ContentEditable from 'react-contenteditable';
import useLocalStorage from '../hooks/useLocalStorage';
const Comment = ({
	currentUser,
	user,
	score,
	id,
	content,
	replies,
	createdAt,
	parentID,
	isReply,
	storedValue,
	setStoredValue,
	...rest
}) => {
	const contentRef = useRef(null);
	const [replyAreaVisible, setReplyAreaVisible] = useState(false);
	const [editable, setEditable] = useState(false);
	const [contentValue, setContentValue] = useState(content);
	const [scoreValue, setScoreValue] = useState(score);
	const [storedCurrentUserValue, setCurrentUserValue] =
		useLocalStorage('currentUser');
	const toggleReplyArea = () => {
		setReplyAreaVisible(currentState => !currentState);
	};
	const deleteComment = () => {
		if (!isReply)
			setStoredValue(prevValue =>
				prevValue.filter(comment => comment.id !== id)
			);
		else
			setStoredValue(prev => {
				const value = [...prev];
				value.find(comment => comment.id === parentID).replies = value
					.find(comment => comment.id === parentID)
					.replies.filter(reply => reply.id !== id);
				return value;
			});
	};
	const editComment = () => {
		setEditable(true);
	};
	const handleUpdateButton = () => {
		setStoredValue(prevValue => {
			if (!isReply) {
				const value = [...prevValue];
				value.find(comment => comment.id === id).content = contentValue;
				return value;
			} else {
				const value = [...prevValue];
				value.forEach(comment => {
					let foundedReply;
					if (comment.replies.length) {
						foundedReply = comment.replies.find(reply => reply.id === id);
						if (foundedReply) {
							foundedReply.content = contentValue;
						}
					}
				});
				return value;
			}
		});
		setEditable(false);
	};
	const handleScore = type => {
		const scoreState = storedCurrentUserValue.scoreStates.find(
			v => v.id === id
		);
		if (scoreState === undefined) {
			if (type === 'increase') {
				setScoreValue(prev => prev + 1);
				setCurrentUserValue(prev => {
					prev.scoreStates = [
						...prev.scoreStates,
						{ id: id, state: 'increased' },
					];
					return prev;
				});
			} else if (type === 'decrease') {
				setScoreValue(prev => prev - 1);
				setCurrentUserValue(prev => {
					prev.scoreStates = [
						...prev.scoreStates,
						{ id: id, state: 'decreased' },
					];
					return prev;
				});
			}
		} else if (scoreState.state === 'increased') {
			if (type === 'increase') {
				setScoreValue(prev => prev - 1);
				setCurrentUserValue(prev => {
					prev.scoreStates.find(v => v.id === id).state = 'initial';
					return prev;
				});
			}
			if (type === 'decrease') {
				setScoreValue(prev => prev - 2);
				setCurrentUserValue(prev => {
					prev.scoreStates.find(v => v.id === id).state = 'decreased';
					return prev;
				});
			}
		} else if (scoreState.state === 'decreased') {
			if (type === 'increase') {
				setScoreValue(prev => prev + 2);
				setCurrentUserValue(prev => {
					prev.scoreStates.find(v => v.id === id).state = 'increased';
					return prev;
				});
			}
			if (type === 'decrease') {
				setScoreValue(prev => prev + 1);
				setCurrentUserValue(prev => {
					prev.scoreStates.find(v => v.id === id).state = 'initial';
					return prev;
				});
			}
		} else {
			if (type === 'increase') {
				setScoreValue(prev => prev + 1);
				setCurrentUserValue(prev => {
					prev.scoreStates.find(v => v.id === id).state = 'increased';
					return prev;
				});
			}
			if (type === 'decrease') {
				setScoreValue(prev => prev - 1);
				setCurrentUserValue(prev => {
					prev.scoreStates.find(v => v.id === id).state = 'decreased';
					return prev;
				});
			}
		}
	};
	return (
		<>
			<div
				className={`comment ${currentUser ? 'current-user' : ''}--${
					editable ? 'editable' : ''
				}`}
				{...rest}
			>
				<div
					className={
						'comment__score ' +
						storedCurrentUserValue.scoreStates.find(v => v.id === id)?.state
					}
				>
					<button className='increase' onClick={() => handleScore('increase')}>
						+
					</button>
					<div className='counter'>{scoreValue}</div>
					<button className='decrease' onClick={() => handleScore('decrease')}>
						-
					</button>
				</div>
				<div className='user'>
					<img className='avatar' alt={user.username} src={user.image.webp} />
					<span className='username'>{user.username}</span>
					<span className='createdAt'>{createdAt}</span>
				</div>
				<div className={`comment__reply ${currentUser ? ' current-user' : ''}`}>
					{!currentUser ? (
						<button className='reply' onClick={toggleReplyArea}>
							<FaReply />
							<span>Reply</span>
						</button>
					) : (
						<>
							<button className='delete' onClick={deleteComment}>
								<AiFillDelete />
								<span>Delete</span>
							</button>
							<button className='edit' onClick={editComment}>
								<MdModeEdit />
								<span>Edit</span>
							</button>
						</>
					)}
				</div>
				<div className='comment__content'>
					<ContentEditable
						innerRef={contentRef}
						html={contentValue}
						onChange={e => setContentValue(e.target.value)}
						disabled={!editable}
						tagName='p'
					/>
				</div>
				{editable && (
					<div className='update__wrapper'>
						<button className='update' onClick={handleUpdateButton}>
							UPDATE
						</button>
					</div>
				)}
			</div>
			<Reply
				isOpen={replyAreaVisible}
				commentId={id}
				isReply={isReply}
				closeReply={() => setReplyAreaVisible(false)}
				parentID={parentID}
				storedValue={storedValue}
				setStoredValue={setStoredValue}
			/>
		</>
	);
};

export default Comment;
