import { Button, Center, HStack, Tag, VStack } from '@chakra-ui/react';
import { useState } from 'react';
import { useQueryClient } from 'react-query';
import styled, { css } from 'styled-components';
import { Theme } from '../../../Theme';
import { useCloseModal } from '../../../hooks/useCloseModal';
import { FileUploadType } from '../../../models/FileUploadType';
import { Project } from '../../../models/Project';
import { Task, TaskStatus } from '../../../models/Task';
import { GigoverFile } from '../../../pages/Files/components/File';
import { useProjectDetails } from '../../../queries/useProjectDetails';
import { useTaskDetails } from '../../../queries/useTaskDetails';
import { useUpdateTask } from '../../../queries/useUpdateTask';
import { ApiService } from '../../../services/ApiService';
import { BorderDiv } from '../../BorderDiv';
import { Comment } from '../../Comment';
import { ConfirmDialog } from '../../ConfirmDialog';
import { DropZone } from '../../DropZone';
import { LoadingSpinner } from '../../LoadingSpinner';
import { Modal } from '../../Modal';
import { User } from '../../User';
import { Edit } from '../../icons/Edit';
import { TrashIcon } from '../../icons/TrashIcon';
import { CommentInput } from './CommentInput';
import { DescriptionUpdate } from './DescriptionUpdate';
import { StatusUpdate } from './StatusUpdate';
import { TaskDateChanger } from './TaskDateChanger';
import { UpdateTaskComponent } from './UpdateTaskComponent';
import { UseResourceOnTask } from './UseResourceOnTask';
import { WorkerAssigneUpdate } from './WorkerAssigneUpdate';

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
	// Get QueryClient from the context
	const queryClient = useQueryClient();

	const closeModal = useCloseModal();
	const [taskTitle, setTaskTitle] = useState(task.subject);
	const { data, isLoading, isError, error } = useTaskDetails(task.taskId);
	const [editing, setEditing] = useState(false);
	const projectTask = data?.projectTask;
	const [dialogOpen, setDialogOpen] = useState(false);

	const { data: projectData } = useProjectDetails(projectId);
	const project: Project | undefined = projectData && projectData.project;

	const {
		mutateAsync: updateTask
		// isLoading: taskLoading,
		// error: taskError
	} = useUpdateTask(projectId);

	// const archiveTask = async () => {
	// 	await updateTask({
	// 		...task,
	// 		status: TaskStatus.Archived
	// 	});

	// 	setDialogOpen(false);
	// 	// i want to close the task modal after archiving the task
	// 	closeModal();
	// };

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
						<VStack align={'start'}>
							<Button
								variant={'link'}
								marginBottom={2}
								colorScheme={'gray'}
								leftIcon={<Edit size={20} color={Theme.colors.darkLightBlue} />}
								onClick={() => setEditing(true)}
							>
								Edit task
							</Button>
							<ConfirmDialog
								header={'Archive task'}
								setIsOpen={setDialogOpen}
								callback={async (b) => {
									if (b) {
										await updateTask({
											...task,
											status: TaskStatus.Archived
										});
									}
									setDialogOpen(false);
									closeModal();
								}}
								isOpen={dialogOpen}
							>
								<Button
									variant={'link'}
									colorScheme={'red'}
									leftIcon={<TrashIcon size={20} color={Theme.colors.red} />}
									onClick={() => {
										setDialogOpen(true);
									}}
								>
									Archive task
								</Button>
							</ConfirmDialog>
						</VStack>
						<div>
							<Tag mb={4}>Project manager</Tag>
							<User
								avatar={projectTask?.project.ownerAvatar || ''}
								name={projectTask?.project.ownerName || 'unknown'}
							/>
						</div>
						{data && data.projectTask && <TaskDateChanger task={data.projectTask} />}
						<StatusUpdate task={task} projectId={projectId} />
						<DescriptionUpdate task={task} projectId={projectId} />
						<WorkerAssigneUpdate
							workers={project?.workers}
							task={task}
							projectId={projectId}
						/>
						{/* TASK FILES */}
						<div style={{ width: '100%' }}>
							<Tag mb={4}>Task files</Tag>
							{/* <Progress size={'sm'} isIndeterminate /> */}
							<DropZone
								offerId={0}
								tenderId={0}
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
											images={projectTask?.images ?? []}
											imageId={taskComment.imageId}
											date={new Date(taskComment.sent)}
										/>
									))
								) : (
									<p>No comments yet</p>
								)}
							</div>
							<div>
								<CommentInput
									projectId={project?.projectId || -1}
									taskId={task.taskId}
									workers={project?.workers ?? []}
								/>
							</div>
						</div>
					</VStack>
				</TaskModalStyled>
			)}
		</Modal>
	);
};
