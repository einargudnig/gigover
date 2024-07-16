import {
	Box,
	Center,
	Drawer,
	DrawerBody,
	DrawerContent,
	DrawerHeader,
	DrawerOverlay,
	Flex,
	FormControl,
	FormLabel,
	HStack,
	IconButton,
	Input,
	Spacer,
	Tab,
	TabList,
	TabPanel,
	TabPanels,
	Tabs,
	Tag,
	VStack,
	useDisclosure
} from '@chakra-ui/react';
import React, { FC, useCallback, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useQueryClient } from 'react-query';
import { useEventListener } from '../hooks/useEventListener';
import { Project } from '../models/Project';
import { Task } from '../models/Task';
import { useProjectDetails } from '../queries/useProjectDetails';
import { ProjectTask, useTaskDetails } from '../queries/useTaskDetails';
import { useUpdateTask } from '../queries/useUpdateTask';
import { Comment } from './Comment';
import { FormActions } from './FormActions';
import { LoadingSpinner } from './LoadingSpinner';
import { User } from './User';
import { DatePicker } from './forms/DatePicker';
import { CrossIcon } from './icons/CrossIcon';
import { VerticalDots } from './icons/VerticalDots';
import { CommentInput } from './modals/TaskModal/CommentInput';
import { DescriptionUpdate } from './modals/TaskModal/DescriptionUpdate';
import { StatusUpdate } from './modals/TaskModal/StatusUpdate';
import { TaskDateChanger } from './modals/TaskModal/TaskDateChanger';
import { UseResourceOnTask } from './modals/TaskModal/UseResourceOnTask';
import { WorkerAssigneUpdate } from './modals/TaskModal/WorkerAssigneUpdate';

export interface TaskModalProps {
	open: boolean;
	title?: string | React.ReactNode;
	onClose?: () => void;
	projectId: number;
	task: Task;
}

export const NewTaskModal: FC<TaskModalProps> = ({ open, title, onClose, projectId, task }) => {
	const queryClient = useQueryClient();
	const [taskTitle, setTaskTitle] = useState(task.subject);
	const { data, isLoading, isError, error } = useTaskDetails(task.taskId);
	const [editing, setEditing] = useState(false);
	const projectTask = data?.projectTask;
	const [dialogOpen, setDialogOpen] = useState(false);

	const { data: projectData } = useProjectDetails(projectId);
	const project: Project | undefined = projectData && projectData.project;

	const { isOpen, onOpen, onClose: chakraOnClose } = useDisclosure({ isOpen: open });

	const {
		getValues,
		control,
		formState: { errors }
	} = useForm<ProjectTask>({
		defaultValues: {
			startDate: task.startDate,
			endDate: task.endDate
		}
	});

	const {
		mutateAsync: updateTask
		// isLoading: taskLoading,
		// error: taskError
	} = useUpdateTask(projectId);

	const closeModal = useCallback(() => {
		if (onClose) {
			onClose();
		}
	}, [onClose]);

	useEventListener('keydown', (event) => {
		if (event.keyCode === 27) {
			closeModal();
		}
	});

	const onSubmit = () => {
		console.log('submit');
	};

	return (
		<Drawer isOpen={isOpen} onClose={chakraOnClose} size="lg">
			<DrawerOverlay />
			<DrawerContent>
				<Flex direction={'column'}>
					<Flex alignItems={'center'}>
						<Box>
							<DrawerHeader>{title}</DrawerHeader>
						</Box>
						<Spacer />
						<Box>
							<Flex alignItems={'center'} mr="4">
								<IconButton
									aria-label="More"
									icon={<VerticalDots />}
									variant="ghost"
								/>
								<IconButton
									aria-label="Close"
									icon={<CrossIcon />}
									variant="ghost"
									onClick={() => closeModal()}
								/>
							</Flex>
						</Box>
					</Flex>
					<DrawerBody>
						{isLoading ? (
							<Center>
								<LoadingSpinner />
							</Center>
						) : isError ? (
							<p>
								Error fetching task with id: {task.taskId} - Reason:{' '}
								{error?.errorText}. Code: {error?.errorCode}
							</p>
						) : null}
						<Tabs colorScheme="black">
							<TabList>
								<Tab>Details</Tab>
								<Tab>Comments</Tab>
							</TabList>

							<TabPanels>
								<TabPanel>
									<div>
										<Tag mb={4}>Project manager</Tag>
										<User
											avatar={projectTask?.project.ownerAvatar || ''}
											name={projectTask?.project.ownerName || 'unknown'}
										/>
									</div>

									<form>
										<VStack mt={6}>
											<FormControl>
												<FormLabel>Task name</FormLabel>
												<Input />
											</FormControl>
											<FormControl>
												<FormLabel>Start and End date</FormLabel>
												<HStack>
													<Controller
														name="startDate"
														control={control}
														defaultValue={
															task?.startDate
																? (task.startDate.valueOf() as number)
																: undefined
														}
														render={({
															field: { onChange, value, onBlur }
														}) => (
															<DatePicker
																selected={
																	value ? new Date(value) : null
																}
																onChange={(date) => {
																	if (date) {
																		onChange(
																			(date as Date).getTime()
																		);
																	} else {
																		onChange(null);
																	}

																	// updateDates();
																}}
																onBlur={() => {
																	onBlur();
																}}
																required={false}
															/>
														)}
													/>
													<Controller
														name="endDate"
														control={control}
														defaultValue={
															task?.endDate
																? (task.endDate.valueOf() as number)
																: undefined
														}
														render={({
															field: { onChange, value, onBlur }
														}) => (
															<DatePicker
																selected={
																	value ? new Date(value) : null
																}
																onChange={(date) => {
																	if (date) {
																		onChange(
																			(date as Date).getTime()
																		);
																	} else {
																		onChange(null);
																	}

																	// updateDates();
																}}
																onBlur={() => {
																	onBlur();
																}}
															/>
														)}
													/>
												</HStack>
											</FormControl>
											{data && data.projectTask && (
												<TaskDateChanger task={data.projectTask} />
											)}
											<StatusUpdate task={task} projectId={projectId} />
											<DescriptionUpdate task={task} projectId={projectId} />
											<WorkerAssigneUpdate
												workers={project?.workers}
												task={task}
												projectId={projectId}
											/>
											<UseResourceOnTask
												task={{ ...task, projectId: projectId }}
											/>
										</VStack>
										<FormActions
											cancelText={'Cancel'}
											onCancel={closeModal}
											submitText={'Create task!'}
											onSubmit={onSubmit}
										/>
									</form>
								</TabPanel>
								<TabPanel>
									<div>
										<HStack spacing={4} justifyContent={'space-between'} mb={4}>
											{isLoading && <LoadingSpinner />}
										</HStack>
										<div>
											{projectTask?.comments &&
											projectTask.comments.length > 0 ? (
												projectTask?.comments.map(
													(taskComment, taskCommentId) => (
														<Comment
															key={taskCommentId}
															author={taskComment.fullName}
															comment={taskComment.comment}
															images={projectTask?.images ?? []}
															imageId={taskComment.imageId}
															date={new Date(taskComment.sent)}
														/>
													)
												)
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
								</TabPanel>
							</TabPanels>
						</Tabs>
					</DrawerBody>
				</Flex>
			</DrawerContent>
		</Drawer>
	);
};
