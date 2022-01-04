import React from 'react';
import { Resource } from '../../models/Resource';
import { Comment } from '../Comment';
import { useResourceComments } from '../../queries/useResourceComments';
import { LoadingSpinner } from '../LoadingSpinner';

export interface ResourceCommentsProps {
	resource: Resource;
}

export const ResourceComments = ({ resource }: ResourceCommentsProps): JSX.Element => {
	const { data, isError, isLoading, error } = useResourceComments(resource.id!);

	if (isLoading) {
		return <LoadingSpinner />;
	}

	if (isError) {
		return <p>Error fetching Resource comments</p>;
	}

	const { comments } = data!;

	return (
		<>
			<div>
				{comments && comments.length > 0 ? (
					comments.map((taskComment, taskCommentId) => (
						<Comment
							key={taskCommentId}
							author={taskComment.fullName}
							comment={taskComment.comment}
							date={new Date(taskComment.sent)}
						/>
					))
				) : (
					<p>No comments yet</p>
				)}
			</div>
		</>
	);
};
