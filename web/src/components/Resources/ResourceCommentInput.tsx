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

			if (response?.data.id) {
				setCommentValue('');
			}
		}
	};

	return (
		<div style={{ flex: '1 0 60px', position: 'sticky', bottom: 0 }}>
			<Input
				name={'comment'}
				placeholder={'Write a comment.. (Press enter to send)'}
				value={commentValue}
				onChange={(e) => setCommentValue(e.target.value)}
				onKeyDown={onKeyPress}
			/>
		</div>
	);
};
