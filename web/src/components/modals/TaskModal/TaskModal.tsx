import React, { useState } from 'react';
import styled from 'styled-components';
import { Modal } from '../../Modal';
import { Task } from '../../../models/Task';
import { useCloseModal } from '../../../hooks/useCloseModal';
import { useTaskDetails } from '../../../queries/useTaskDetails';
import { User } from '../../User';
import { LoadingSpinner } from '../../LoadingSpinner';
import { CommentInput } from './CommentInput';
import { Comment } from '../../Comment';
import { StatusUpdate } from './StatusUpdate';
import { Button } from '../../forms/Button';
import { UpdateTaskComponent } from './UpdateTaskComponent';
import { Divider } from '../../Divider';

const TaskModalStyled = styled.div`
	h3 {
		display: flex;
		align-items: center;
		margin-bottom: ${(props) => props.theme.padding(2)};
		border-bottom: 1px solid ${(props) => props.theme.colors.border};
		padding-bottom: ${(props) => props.theme.padding(2)};

		svg {
			margin-left: 8px;
		}
	}
`;

interface TaskModalProps {
	projectId: number;
	task: Task;
}

export const TaskModal = ({ task, projectId }: TaskModalProps): JSX.Element => {
	const closeModal = useCloseModal();
	const [taskTitle, setTaskTitle] = useState(task.text);
	const { data, isLoading, isError, error } = useTaskDetails(task.taskId);
	const [editing, setEditing] = useState(false);
	const projectTask = data?.projectTask;

	return (
		<Modal
			open={true}
			title={<p style={{ maxWidth: '400px' }}>{editing ? `Edit ${taskTitle}` : task.text}</p>}
			onClose={closeModal}
		>
			{isLoading ? (
				<div>
					<LoadingSpinner />
				</div>
			) : isError ? (
				<p>
					Error fetching task with id: {task.taskId} - Reason: {error?.errorText}. Code:{' '}
					{error?.errorCode}
				</p>
			) : editing ? (
				<TaskModalStyled>
					<UpdateTaskComponent
						task={task}
						projectId={projectId}
						onChange={(value) => setTaskTitle(value)}
						onClose={(closeDetails) => {
							setEditing(false);

							if (closeDetails) {
								closeModal();
							}
						}}
					/>
				</TaskModalStyled>
			) : (
				<TaskModalStyled>
					<div>
						<h3>Modify task</h3>
						<Button onClick={() => setEditing(true)}>Edit task</Button>
					</div>
					<Divider />
					<div>
						<h3>Project owner</h3>
						<User
							avatar={projectTask?.project.ownerAvatar || ''}
							name={projectTask?.project.ownerName || 'unknown'}
						/>
					</div>
					<Divider />
					<StatusUpdate task={task} projectId={projectId} />
					<Divider />
					<div>
						<h3>Comments {isLoading && <LoadingSpinner />}</h3>
						<div>
							{projectTask?.comments && projectTask.comments.length > 0 ? (
								projectTask?.comments.map((taskComment, taskCommentId) => (
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
						<div>
							<CommentInput
								projectId={projectTask?.project.projectId || -1}
								taskId={task.taskId}
							/>
						</div>
					</div>
				</TaskModalStyled>
			)}
		</Modal>
	);
};
