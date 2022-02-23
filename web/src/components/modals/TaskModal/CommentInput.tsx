import React, { useCallback, useState } from 'react';
import { useTaskComment } from '../../../queries/useTaskComment';
import { MentionsInput, Mention } from 'react-mentions';
import { WorkerItem } from '../../../models/Project';
import mentionsCls from '../../../styles/mentions.module.css';
import { CommentInputLabel } from '../../CommentInputLabel';

interface CommentInputProps {
	projectId: number;
	taskId: number;
	workers: WorkerItem[];
}

export const CommentInput = ({ projectId, taskId, workers }: CommentInputProps): JSX.Element => {
	const [commentValue, setCommentValue] = useState('');
	const { mutateAsync: addComment, isLoading } = useTaskComment();

	const onKeyPress = useCallback(
		async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
			if (!e.shiftKey && e.key === 'Enter' && !isLoading && commentValue.trim().length > 0) {
				e.preventDefault();
				e.persist();

				const response = await addComment({
					comment: commentValue,
					projectId: projectId,
					taskId: taskId
				});

				if (response?.data.errorCode === 'OK') {
					setCommentValue('');
				}
			}
		},
		[addComment, commentValue, isLoading, projectId, taskId]
	);

	return (
		<>
			<MentionsInput
				placeholder={'Write a comment'}
				allowSpaceInQuery={true}
				allowSuggestionsAboveCursor={true}
				onKeyPress={(e) => onKeyPress(e)}
				value={commentValue}
				classNames={mentionsCls}
				onChange={(event, newValue) => setCommentValue(newValue)}
			>
				<Mention
					trigger="@"
					data={workers.map((w) => ({
						id: w.uId,
						display: w.name ?? w.userName ?? 'Unknown user'
					}))}
				/>
			</MentionsInput>
			<CommentInputLabel />
		</>
	);
};
