import React, { useState } from 'react';
import { useTaskComment } from '../../../queries/useTaskComment';
import { Input } from '../../forms/Input';

interface CommentInputProps {
	projectId: number;
	taskId: number;
}

export const CommentInput = ({ projectId, taskId }: CommentInputProps): JSX.Element => {
	const [commentValue, setCommentValue] = useState('');
	const { mutateAsync: addComment, isLoading } = useTaskComment();

	const onKeyPress = async (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter' && !isLoading) {
			const response = await addComment({
				comment: commentValue,
				projectId: projectId,
				taskId: taskId
			});

			if (response?.data.errorCode === 'OK') {
				setCommentValue('');
			}
		}
	};

	return (
		<>
			<Input
				name={'comment'}
				placeholder={'Write a comment..'}
				value={commentValue}
				onChange={(e) => setCommentValue(e.target.value)}
				onKeyDown={onKeyPress}
			/>
		</>
	);
};
