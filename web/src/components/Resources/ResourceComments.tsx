import { Resource } from '../../models/Resource';
import { useResourceComments } from '../../queries/useResourceComments';
import { Comment } from '../Comment';
import { LoadingSpinner } from '../LoadingSpinner';

export interface ResourceCommentsProps {
	resource: Resource;
}

export const ResourceComments = ({ resource }: ResourceCommentsProps): JSX.Element => {
	const { data, isError, isPending } = useResourceComments(resource.id!);

	if (isPending) {
		return <LoadingSpinner />;
	}

	if (isError) {
		return <p>Error fetching Resource comments</p>;
	}

	const { resources: comments } = data!;

	return (
		<>
			<div style={{ flex: '0 0' }}>
				{comments && comments.length > 0 ? (
					comments.map((taskComment, taskCommentId) => (
						<Comment
							key={taskCommentId}
							author={taskComment.fullName}
							comment={taskComment.comment}
							imageId={0}
							images={[]}
							date={new Date(taskComment.sent)}
						/>
					))
				) : (
					<p style={{ marginBottom: 24 }}>No comments yet</p>
				)}
			</div>
		</>
	);
};
