import React, { useState } from 'react';
import styled from 'styled-components';
import { Modal } from '../Modal';
import { Task } from '../../models/Task';
import { useCloseModal } from '../../hooks/useCloseModal';
import { useTaskDetails } from '../../queries/useTaskDetails';
import { Input } from '../forms/Input';
import { useTaskComment } from '../../queries/useTaskComment';

const TaskModalStyled = styled.div``;

interface TaskModalProps {
	task: Task;
}

export const TaskModal = ({ task }: TaskModalProps): JSX.Element => {
	const closeModal = useCloseModal();
	const [commentValue, setCommentValue] = useState('');
	const { data, isLoading, isError, error } = useTaskDetails(task.taskId);
	const [addComment, { isLoading: commentLoading, isError: commentError }] = useTaskComment();

	const projectTask = data?.projectTask;

	const onKeyPress = async (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter' && !commentLoading && projectTask) {
			await addComment({
				comment: commentValue,
				projectId: projectTask.project.projectId,
				taskId: task.taskId
			});

			setCommentValue('');
		}
	};

	return (
		<Modal open={true} title={task.text} onClose={closeModal}>
			{isLoading ? (
				<p>// TODO Loading</p>
			) : isError ? (
				<p>// TODO Errors</p>
			) : (
				<div>
					<div>
						<img src={projectTask?.project.ownerAvatar} width={64} height={64} />
						<p>{projectTask?.project.ownerName}</p>
					</div>
					<div>
						<h3>Comments</h3>
						<div>
							{projectTask?.comments && projectTask.comments.length > 0 && (
								<ul>
									{projectTask?.comments.map((taskComment, taskCommentId) => (
										<li key={taskCommentId}>
											{taskComment.fullName}:{taskComment.comment}
											<br />
											<br />
											{new Date(taskComment.sent).toString()}
										</li>
									))}
								</ul>
							)}
						</div>
						<h3>Add comment</h3>
						<div>
							<Input
								name={'comment'}
								placeholder={'Write a comment..'}
								value={commentValue}
								onChange={(e) => setCommentValue(e.target.value)}
								onKeyDown={onKeyPress}
							/>
						</div>
					</div>
				</div>
			)}
		</Modal>
	);
};
