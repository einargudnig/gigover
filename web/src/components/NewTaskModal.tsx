import {
	Box,
	Button,
	Center,
	Drawer,
	DrawerBody,
	DrawerContent,
	DrawerFooter,
	DrawerHeader,
	DrawerOverlay,
	Flex,
	FormControl,
	FormLabel,
	HStack,
	IconButton,
	Input,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	SkeletonCircle,
	SkeletonText,
	Spacer,
	Tab,
	TabList,
	TabPanel,
	TabPanels,
	Tabs,
	Text,
	Textarea,
	VStack,
	useDisclosure
} from '@chakra-ui/react';
import React, { FC, useCallback, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useQueryClient } from 'react-query';
import { useEventListener } from '../hooks/useEventListener';
import { FileUploadType } from '../models/FileUploadType';
import { Project } from '../models/Project';
import { ProjectType } from '../models/ProjectType';
import { Task, TaskStatus } from '../models/Task';
import { GigoverFile } from '../pages/Files/components/File';
import { useProjectDetails } from '../queries/useProjectDetails';
import { useProjectTypes } from '../queries/useProjectTypes';
import { ProjectTask, useTaskDetails } from '../queries/useTaskDetails';
import { useUpdateTask } from '../queries/useUpdateTask';
import { ApiService } from '../services/ApiService';
import { Comment } from './Comment';
import { ConfirmDialog } from './ConfirmDialog';
import { DropZone } from './DropZone';
import { LoadingSpinner } from './LoadingSpinner';
import { TrackerSelect } from './TrackerSelect';
import { User } from './User';
import { DatePicker } from './forms/DatePicker';
import { Options } from './forms/Options';
import { CrossIcon } from './icons/CrossIcon';
import { TrashIcon } from './icons/TrashIcon';
import { VerticalDots } from './icons/VerticalDots';
import { CommentInput } from './modals/TaskModal/CommentInput';
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
	const { data, isLoading, isError, error } = useTaskDetails(task.taskId);
	const projectTask = data?.projectTask;
	const { data: projectData } = useProjectDetails(projectId);
	const [dialogOpen, setDialogOpen] = useState(false);

	const project: Project | undefined = projectData && projectData.project;
	const { data: projectTypes } = useProjectTypes();

	const { isOpen, onClose: chakraOnClose } = useDisclosure({ isOpen: open });

	const { handleSubmit, control } = useForm<ProjectTask>({
		defaultValues: {
			taskId: task.taskId,
			subject: task.subject,
			text: task.text,
			typeId: task.typeId,
			startDate: task.startDate,
			endDate: task.endDate,
			status: task.status
		}
	});

	const {
		mutateAsync: updateTask,
		isLoading: taskLoading
		// error: taskError
	} = useUpdateTask(projectId);

	const closeModal = useCallback(() => {
		if (onClose) {
			console.log('Closing drawer');
			onClose();
		}
	}, [onClose]);

	useEventListener('keydown', (event) => {
		if (event.keyCode === 27) {
			closeModal();
		}
	});

	const onSubmit = handleSubmit(
		async ({ taskId, subject, text, typeId, startDate, endDate, status }) => {
			console.log({ taskId, subject, text, typeId, startDate, endDate, status });
			try {
				await updateTask({
					taskId,
					subject,
					text,
					typeId,
					startDate,
					endDate,
					status
				});

				closeModal();
			} catch (e) {
				console.log(e);
			}
		}
	);

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
								<Menu>
									<MenuButton
										as={IconButton}
										aria-label="More"
										icon={<VerticalDots />}
										variant="ghost"
										_active={{ bg: 'gray.100' }}
									/>
									<MenuList>
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
											<MenuItem
												icon={<TrashIcon />}
												onClick={() => {
													setDialogOpen(true);
												}}
											>
												Archive task
											</MenuItem>
										</ConfirmDialog>
									</MenuList>
								</Menu>
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
						<Tabs colorScheme="black">
							<TabList>
								<Tab>Details</Tab>
								<Tab>Comments</Tab>
								<Tab>Files</Tab>
								<Tab>Workers</Tab>
								<Tab>Resources</Tab>
							</TabList>

							<TabPanels>
								{/* //! Details */}
								<TabPanel>
									{isLoading ? (
										<>
											<Box marginTop={4}>
												<SkeletonCircle size="8" />
												<SkeletonText mt="4" noOfLines={12} spacing="6" />
											</Box>
										</>
									) : (
										<>
											<Flex direction={'column'}>
												<Box flex={'1'} overflowY={'auto'}>
													<Box>
														<FormLabel>Project manager</FormLabel>
														<User
															avatar={
																projectTask?.project.ownerAvatar ||
																''
															}
															name={
																projectTask?.project.ownerName ||
																'unknown'
															}
														/>
													</Box>

													<form id="updateTask" onSubmit={onSubmit}>
														<VStack mt={6}>
															<FormControl id="subject">
																<FormLabel>Task name</FormLabel>
																<Controller
																	name={'subject'}
																	control={control}
																	render={({
																		field: {
																			onChange,
																			onBlur,
																			value
																		}
																	}) => (
																		<Input
																			onChange={onChange}
																			onBlur={onBlur}
																			value={value}
																		/>
																	)}
																/>
															</FormControl>
															<FormControl id={'typeId'}>
																<FormLabel>Tags</FormLabel>
																<Controller
																	name={'typeId'}
																	control={control}
																	render={({
																		field: {
																			onChange: ptChange,
																			value: ptValue = task.typeId,
																			onBlur
																		}
																	}) => (
																		<Options
																			isMulti={false}
																			onBlur={onBlur}
																			onChange={(
																				newValue
																			) => {
																				const v = (
																					newValue as ProjectType
																				).typeId;
																				ptChange(
																					parseInt(`${v}`)
																				);
																			}}
																			value={projectTypes?.projectTypes.find(
																				(pt) =>
																					pt.typeId ===
																					ptValue
																			)}
																			getOptionLabel={(
																				option: unknown
																			) =>
																				(
																					option as ProjectType
																				).name
																			}
																			getOptionValue={(
																				option: unknown
																			) =>
																				(
																					option as ProjectType
																				)
																					.typeId as unknown as string
																			}
																			options={
																				projectTypes?.projectTypes ||
																				[]
																			}
																		/>
																	)}
																/>
															</FormControl>
															<FormControl>
																<FormLabel>
																	Start and End date
																</FormLabel>
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
																			field: {
																				onChange,
																				value,
																				onBlur
																			}
																		}) => (
																			<DatePicker
																				selected={
																					value
																						? new Date(
																								value
																						  )
																						: null
																				}
																				onChange={(
																					date
																				) => {
																					if (date) {
																						onChange(
																							(
																								date as Date
																							).getTime()
																						);
																					} else {
																						onChange(
																							null
																						);
																					}
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
																			field: {
																				onChange,
																				value,
																				onBlur
																			}
																		}) => (
																			<DatePicker
																				selected={
																					value
																						? new Date(
																								value
																						  )
																						: null
																				}
																				onChange={(
																					date
																				) => {
																					if (date) {
																						onChange(
																							(
																								date as Date
																							).getTime()
																						);
																					} else {
																						onChange(
																							null
																						);
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

															<FormControl id="status">
																<FormLabel>Task status</FormLabel>
																<Controller
																	name="status"
																	control={control}
																	defaultValue={task.status}
																	render={({
																		field: { onChange, value }
																	}) => (
																		<TrackerSelect
																			title={'Status'}
																			value={value}
																			options={[
																				{
																					value: TaskStatus.Backlog,
																					label: 'Backlog'
																				},
																				{
																					value: TaskStatus.Todo,
																					label: 'Todo'
																				},
																				{
																					value: TaskStatus.Doing,
																					label: 'Doing'
																				},
																				{
																					value: TaskStatus.Done,
																					label: 'Done'
																				}
																			]}
																			valueChanged={onChange}
																		/>
																	)}
																/>
															</FormControl>
															<FormControl id="text">
																<FormLabel>Description</FormLabel>
																<Controller
																	name="text"
																	control={control}
																	defaultValue={task.text}
																	rules={{
																		maxLength: {
																			value: 599,
																			message:
																				'Description must be less than 600 characters' // Custom error message
																		}
																	}}
																	render={({
																		field: {
																			onChange,
																			onBlur,
																			value
																		},
																		fieldState: {
																			error: formError
																		}
																	}) => (
																		<>
																			<Textarea
																				value={value}
																				onChange={onChange}
																				onBlur={onBlur}
																				placeholder="Write a description for this task"
																				colorScheme={'gray'}
																				size={'md'}
																				variant={'outline'}
																				isInvalid={
																					!!formError
																				}
																				borderColor={
																					'gray.100'
																				} // Sets the color of the border
																				borderWidth={'2px'} // Sets the width of the border
																				borderStyle={
																					'solid'
																				} // Optional: Sets the style of the border
																				rounded={'md'} // Sets the border-radius
																				p={1}
																			/>
																			{formError && (
																				<Text
																					textColor={
																						'red.600'
																					}
																					mt={2}
																				>
																					{
																						formError.message
																					}
																				</Text>
																			)}
																		</>
																	)}
																/>
															</FormControl>

															{/* <FormControl id="worker">
														<FormLabel>Assigned to</FormLabel>
														<Controller
															name="worker"
															control={control}
															defaultValue={task.worker?.uId}
															render={({
																field: { onChange, value }
															}) => (
																<TrackerSelect
																	title={'Worker'}
																	value={value}
																	options={
																		project?.workers.map(
																			(worker) => ({
																				value: worker.uId,
																				label: worker.name
																			})
																		) ?? []
																	}
																	valueChanged={onChange}
																/>
															)}
														/>
														<TrackerSelect
															title={'Worker'}
															value={task.worker?.uId}
															options={
																project?.workers.map((worker) => ({
																	value: worker.uId,
																	label: worker.name
																})) ?? []
															}
															valueChanged={(newValue) =>
																// updateTaskStatus(newValue as TaskStatusType)
																console.log(newValue)
															}
														/>
													</FormControl> */}
														</VStack>
													</form>
													<DrawerFooter>
														<Button
															type="submit"
															form="updateTask"
															colorScheme="gray"
															isLoading={taskLoading}
														>
															Save
														</Button>
													</DrawerFooter>
												</Box>
											</Flex>
										</>
									)}
								</TabPanel>
								{/* //! Comments panel */}
								<TabPanel>
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
									<Box height={'650px'}>
										<HStack spacing={4} justifyContent={'space-between'} mb={4}>
											{isLoading && <LoadingSpinner />}
										</HStack>
										<Flex direction={'column'} height={'100%'}>
											<Box flex={'1'} overflowY={'auto'}>
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
											</Box>
											<Box>
												<CommentInput
													projectId={project?.projectId || -1}
													taskId={task.taskId}
													workers={project?.workers ?? []}
												/>
											</Box>
										</Flex>
									</Box>
								</TabPanel>
								{/* //! Files for task */}
								<TabPanel>
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
										{/* // eslint-disable-next-line @typescript-eslint/no-unused-vars */}
										{({ isDragActive, open }) => (
											<Box
												border={'2px'}
												rounded={'md'}
												borderColor={'gray.100'}
												p={1}
												_hover={{ borderColor: 'green.200' }}
											>
												{projectTask?.images &&
												projectTask?.images.length > 0 ? (
													<Box>
														<Flex
															alignItems={'center'}
															justifyContent={'center'}
														>
															<Button
																onClick={() => open()}
																colorScheme="gray"
																mb={2}
															>
																Upload
															</Button>
														</Flex>
														{projectTask?.images.map((f, fIndex) => (
															<GigoverFile file={f} key={fIndex} />
														))}
													</Box>
												) : (
													<Box w={'full'}>
														<Flex
															alignItems={'center'}
															justifyContent={'center'}
														>
															<Text>
																No task files, drop files here to
																upload some.
															</Text>
															<Button
																ml={2}
																onClick={() => open()}
																colorScheme="gray"
															>
																Upload
															</Button>
														</Flex>
													</Box>
												)}
											</Box>
										)}
									</DropZone>
								</TabPanel>
								{/* //! Workers for task */}
								<TabPanel>
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
									<Box>
										<Text mb={2}>Select a worker to assign this task</Text>
										<HStack>
											<WorkerAssigneUpdate
												projectId={projectId}
												task={task}
												workers={project?.workers}
											/>
										</HStack>
									</Box>
								</TabPanel>
								{/* //! Resources for task */}
								<TabPanel>
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
									<Box>
										<Text mb={2}>Select a resource to use on this task</Text>
										<HStack>
											<UseResourceOnTask
												task={{ ...task, projectId: projectId }}
											/>
										</HStack>
									</Box>
								</TabPanel>
							</TabPanels>
						</Tabs>
					</DrawerBody>
				</Flex>
			</DrawerContent>
		</Drawer>
	);
};
