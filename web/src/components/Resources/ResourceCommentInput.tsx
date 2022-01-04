import React, { useState } from 'react';
import { Input } from '../forms/Input';
import { useResourceComment } from '../../mutations/useResourceComment';

interface CommentInputProps {
	resourceId: number;
}

export const CommentInput = ({ resourceId }: CommentInputProps): JSX.Element => {
	const [commentValue, setCommentValue] = useState('');
	const { mutateAsync: addComment, isLoading } = useResourceComment();

	const onKeyPress = async (e: React.KeyboardEvent<HTMLInputElement>) => {

		if (e.key === 'Enter' && !isLoading) {
			e.stopPropagation();
			e.preventDefault();

			const response = await addComment({
				comment: commentValue,
				resourceId: resourceId
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
				placeholder={'Write a comment.. (Press enter to send)'}
				value={commentValue}
				onChange={(e) => setCommentValue(e.target.value)}
				onKeyDown={onKeyPress}
			/>
		</>
	);
};
