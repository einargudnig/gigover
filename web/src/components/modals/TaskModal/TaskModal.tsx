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
import { useFileService } from '../../../hooks/useFileService';
import { FileDocument } from '../../../services/FileSystemService';
import { FileUploadType } from '../../../models/FileUploadType';
import { File } from '../../../pages/Files/components/File';
import { ProjectFile } from '../../../models/ProjectFile';
import { DropZone } from '../../DropZone';

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

const TaskFilesContainer = styled.div<{ isDragActive: boolean }>`
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
	const [taskTitle, setTaskTitle] = useState(task.text);
	const [taskFiles, setTaskFiles] = useState<ProjectFile[]>([]);
	const { fileService } = useFileService();
	const { data, isLoading, isError, error } = useTaskDetails(task.taskId);
	const [editing, setEditing] = useState(false);
	const projectTask = data?.projectTask;

	useEffect(() => {
		fileService.getProjectFilesDb(projectId, (snapshot) => {
			if (snapshot !== null && snapshot.exists()) {
				const files: ProjectFile[] = [];
				const map = Object.entries<FileDocument>(snapshot.val());

				map.forEach(([, value]) => {
					if (
						value.type === FileUploadType.Task &&
						value.externalId &&
						value.externalId === task.taskId
					) {
						files.push(new ProjectFile(value));
					}
				});

				setTaskFiles(files);
			}
		});
	}, []);

	return (
		<Modal open={true} title={editing ? `Edit ${taskTitle}` : task.text} onClose={closeModal}>
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
						<div style={{ width: '100%' }}>
							<Tag mb={4}>Task files</Tag>
							<DropZone
								projectId={projectId}
								uploadType={FileUploadType.Task}
								externalId={task.taskId}
							>
								{({ isDragActive }) => (
									<TaskFilesContainer isDragActive={isDragActive}>
										{taskFiles.length > 0 ? (
											taskFiles.map((f, fIndex) => (
												<File file={f} key={fIndex} />
											))
										) : (
											<span>
												No task files, drop files here to upload some.
											</span>
										)}
									</TaskFilesContainer>
								)}
							</DropZone>
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
