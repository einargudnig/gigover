import { Box, Textarea } from '@chakra-ui/react';
import React, { useState } from 'react';
import { Resource } from '../../models/Resource';
import { useResourceComment } from '../../mutations/useResourceComment';

export const ResourceCommentInput = ({ resource }: { resource: Resource }) => {
	const [commentValue, setCommentValue] = useState('');
	const { mutateAsync: addComment, isPending } = useResourceComment();

	const handleComment = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === 'Enter' && !isPending && !e.shiftKey) {
			e.preventDefault();
			await addComment({ resourceId: resource.id!, comment: commentValue });
			setCommentValue('');
		}
	};

	return (
		<Box pt={4}>
			<Textarea
				placeholder="Add a comment... (Press Enter to send, Shift+Enter for new line)"
				value={commentValue}
				onChange={(e) => setCommentValue(e.target.value)}
				onKeyDown={handleComment}
				size="sm"
				resize="none"
			/>
		</Box>
	);
};
