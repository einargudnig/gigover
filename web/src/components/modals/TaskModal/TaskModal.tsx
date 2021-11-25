import React, { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import { Modal } from '../../Modal';
import { Task } from '../../../models/Task';
import { useCloseModal } from '../../../hooks/useCloseModal';
import { useTaskDetails } from '../../../queries/useTaskDetails';
import { User } from '../../User';
import { LoadingSpinner } from '../../LoadingSpinner';
import { CommentInput } from './CommentInput';
import { Comment } from '../../Comment';
import { StatusUpdate } from './StatusUpdate';
import { UpdateTaskComponent } from './UpdateTaskComponent';
import { Button, Center, HStack, Tag, VStack } from '@chakra-ui/react';
import { TaskDateChanger } from './TaskDateChanger';
import { Theme } from '../../../Theme';
import { Edit } from '../../icons/Edit';
import { FileUploadType } from '../../../models/FileUploadType';
import { DropZone } from '../../DropZone';
import { GigoverFile } from '../../../pages/Files/components/File';
import { ProjectImage } from '../../../models/ProjectImage';
import { UseResourceOnTask } from './UseResourceOnTask';
import { BorderDiv } from '../../BorderDiv';
import { ApiService } from '../../../services/ApiService';
import { useQueryClient } from 'react-query';
import { DescriptionUpdate } from "./DescriptionUpdate";
import { WorkerAssigneUpdate } from "./WorkerAssigneUpdate";

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

const TaskFilesContainer = styled(BorderDiv)<{ isDragActive: boolean }>`
	width: 100%;
	padding: ${(props) => props.theme.padding(2)};
	border: 1px solid ${(props) => props.theme.colors.border};
	border-radius: ${(props) => props.theme.borderRadius};

	${(props) =>
		props.isDragActive &&
		css`
			border-color: ${props.theme.colors.green};
		`};
`;

interface TaskModalProps {
	projectId: number;
	task: Task;
}

export const TaskModal = ({ task, projectId }: TaskModalProps): JSX.Element => {
	const closeModal = useCloseModal();
	const [taskTitle, setTaskTitle] = useState(task.subject);
	const { data, isLoading, isError, error } = useTaskDetails(task.taskId);
	// Get QueryClient from the context
	const queryClient = useQueryClient();
	const [editing, setEditing] = useState(false);
	const projectTask = data?.projectTask;

	return (
		<Modal
			open={true}
			title={editing ? `Edit ${taskTitle}` : task.subject}
			onClose={closeModal}
			maxWidth={600}
		>
			{isLoading ? (
				<Center>
					<LoadingSpinner />
				</Center>
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
					<VStack
						spacing={8}
						justifyContent={'stretch'}
						alignItems={'flex-start'}
						style={{ width: '100%' }}
					>
						<div>
							<Button
								variant={'link'}
								colorScheme={'gray'}
								leftIcon={<Edit size={20} color={Theme.colors.darkLightBlue} />}
								onClick={() => setEditing(true)}
							>
								Edit task
							</Button>
						</div>
						<div>
							<Tag mb={4}>Project owner</Tag>
							<User
								avatar={projectTask?.project.ownerAvatar || ''}
								name={projectTask?.project.ownerName || 'unknown'}
							/>
						</div>
						{data && data.projectTask && <TaskDateChanger task={data.projectTask} />}
						<StatusUpdate task={task} projectId={projectId} />
						<DescriptionUpdate task={task} projectId={projectId} />
						<WorkerAssigneUpdate task={task} projectId={projectId} />
						<StatusUpdate task={task} projectId={projectId} />
						<div style={{ width: '100%' }}>
							<Tag mb={4}>Task files</Tag>
							<DropZone
								projectId={projectId}
								uploadType={FileUploadType.Task}
								externalId={task.taskId}
								callback={() => {
									queryClient.invalidateQueries(
										ApiService.taskDetails(task.taskId)
									);
								}}
							>
								{({ isDragActive, open }) => (
									<TaskFilesContainer isDragActive={isDragActive}>
										{projectTask?.images && projectTask?.images.length > 0 ? (
											<div>
												<Button ml={2} onClick={() => open()}>
													Upload
												</Button>
												{projectTask?.images.map((f, fIndex) => (
													<GigoverFile file={f} key={fIndex} />
												))}
											</div>
										) : (
											<div>
												<span>
													No task files, drop files here to upload some.
												</span>
												<Button ml={2} onClick={() => open()}>
													Upload
												</Button>
											</div>
										)}
									</TaskFilesContainer>
								)}
							</DropZone>
						</div>
						<div style={{ width: '100%' }}>
							<Tag mb={4}>Use resource</Tag>
							<HStack spacing={2}>
								<UseResourceOnTask task={{ ...task, projectId: projectId }} />
							</HStack>
						</div>
						<div style={{ width: '100%' }}>
							<HStack spacing={4} justifyContent={'space-between'} mb={4}>
								<Tag mb={4}>Comments</Tag>
								{isLoading && <LoadingSpinner />}
							</HStack>
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
					</VStack>
				</TaskModalStyled>
			)}
		</Modal>
	);
};
