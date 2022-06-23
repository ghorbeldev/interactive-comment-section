import Container from './components/container/Container';
import './scss/App.scss';
import data from './config/data.json';
import Comment from './components/comment/Comment';
import useLocalStorage from './components/hooks/useLocalStorage';
import { useEffect } from 'react';
import Reply from './components/reply/Reply';
function App() {
	const [storedValue, setValue] = useLocalStorage('comments');
	const [storedCurrentUserValue, setCurrentUserValue] =
		useLocalStorage('currentUser');
	useEffect(() => {
		if (!storedValue) {
			setValue(data.comments);
		}
		if (!storedCurrentUserValue) {
			setCurrentUserValue(data.currentUser);
		}
	}, [storedValue, setValue]);
	return (
		<div id='app'>
			<Container>
				{storedValue &&
					storedValue.map(comment => (
						<div className='comment-box' key={comment.id}>
							<Comment
								id={comment.id}
								user={comment.user}
								createdAt={comment.createdAt}
								content={comment.content}
								score={comment.score}
								isReply={false}
								currentUser={
									comment.user.username === data.currentUser.username
								}
							/>
							{comment.replies.length ? (
								<div className='replies__container'>
									{comment.replies.map(replie => (
										<Comment
											key={replie.id}
											id={replie.id}
											user={replie.user}
											createdAt={replie.createdAt}
											content={replie.content}
											score={replie.score}
											isReply={true}
											parentID={comment.id}
											currentUser={
												replie.user.username === data.currentUser.username
											}
										/>
									))}
								</div>
							) : null}
						</div>
					))}
				<Reply isOpen={true} comment={true} />
			</Container>
		</div>
	);
}

export default App;
