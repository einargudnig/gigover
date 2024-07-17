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
import { DropZone } from './DropZone';
import { LoadingSpinner } from './LoadingSpinner';
import { TrackerSelect } from './TrackerSelect';
import { User } from './User';
import { DatePicker } from './forms/DatePicker';
import { Options } from './forms/Options';
import { CrossIcon } from './icons/CrossIcon';
import { VerticalDots } from './icons/VerticalDots';
import { CommentInput } from './modals/TaskModal/CommentInput';
import { UseResourceOnTask } from './modals/TaskModal/UseResourceOnTask';

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
	// description
	const [descValue, setDescValue] = useState(task.text);
	const [descToLong, setDescToLong] = useState(false);

	const { data: projectData } = useProjectDetails(projectId);
	const project: Project | undefined = projectData && projectData.project;
	const { data: projectTypes } = useProjectTypes();

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

	const handleChange = (event) => {
		setDescValue(event.target.value);
		setDescToLong(event.target.value.length > 600);
	};

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
					<DrawerBody
						style={{
							overflowY: 'auto' // Enables vertical scrolling
						}}
					>
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
								<Tab>Files</Tab>
								<Tab>Resources</Tab>
							</TabList>

							<TabPanels>
								{/* //! Details */}
								<TabPanel>
									<Box>
										<FormLabel>Project manager</FormLabel>
										<User
											avatar={projectTask?.project.ownerAvatar || ''}
											name={projectTask?.project.ownerName || 'unknown'}
										/>
									</Box>

									<form id="updateTask">
										<VStack mt={6}>
											<FormControl>
												<FormLabel>Task name</FormLabel>
												<Input />
											</FormControl>
											<FormControl id={'typeId'}>
												<FormLabel>Tags</FormLabel>
												<Controller
													name={'typeId'}
													control={control}
													render={({
														field: {
															onChange: ptChange,
															value: ptValue,
															onBlur
														}
													}) => (
														<Options
															isMulti={false}
															onBlur={onBlur}
															onChange={(newValue) => {
																const v = (newValue as ProjectType)
																	.typeId;
																ptChange(parseInt(`${v}`));
															}}
															value={projectTypes?.projectTypes.find(
																(pt) => pt.typeId === ptValue
															)}
															getOptionLabel={(option: unknown) =>
																(option as ProjectType).name
															}
															getOptionValue={(option: unknown) =>
																(option as ProjectType)
																	.typeId as unknown as string
															}
															options={
																projectTypes?.projectTypes || []
															}
														/>
													)}
												/>
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
											{/* {data && data.projectTask && (
												<TaskDateChanger task={data.projectTask} />
											)} */}
											<FormControl>
												<FormLabel>Task status</FormLabel>
												<TrackerSelect
													title={'Status'}
													value={task.status}
													options={[
														{
															value: TaskStatus.Backlog,
															label: 'Backlog'
														},
														{ value: TaskStatus.Todo, label: 'Todo' },
														{ value: TaskStatus.Doing, label: 'Doing' },
														{ value: TaskStatus.Done, label: 'Done' }
													]}
													valueChanged={(newValue) =>
														// updateTaskStatus(newValue as TaskStatusType)
														console.log(newValue)
													}
												/>
											</FormControl>
											{/* <StatusUpdate task={task} projectId={projectId} /> */}
											<FormControl>
												<FormLabel>Description</FormLabel>
												<Textarea
													value={descValue}
													onChange={handleChange}
													placeholder="Write a description for this task"
													colorScheme={'gray'}
													size={'md'}
													variant={'outline'}
													isInvalid={descToLong}
													errorBorderColor={'red.300'}
													borderColor={'gray.100'} // Sets the color of the border
													borderWidth={'2px'} // Sets the width of the border
													borderStyle={'solid'} // Optional: Sets the style of the border
													rounded={'md'} // Sets the border-radius
													p={1}
												/>
											</FormControl>
											{/* <DescriptionUpdate task={task} projectId={projectId} /> */}
											<FormControl>
												<FormLabel>Assigned to</FormLabel>
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
											</FormControl>
										</VStack>
									</form>
									<DrawerFooter>
										<Button type="submit" form="updateTask" colorScheme="gray">
											Save
										</Button>
									</DrawerFooter>
								</TabPanel>
								{/* //! Comments panel */}
								<TabPanel>
									<Box height={'600px'}>
										<HStack spacing={4} justifyContent={'space-between'} mb={4}>
											{isLoading && <LoadingSpinner />}
										</HStack>
										<Flex direction={'column'}>
											<Box>
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
														<Button ml={2} onClick={() => open()}>
															Upload
														</Button>
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
															<Button ml={2} onClick={() => open()}>
																Upload
															</Button>
														</Flex>
													</Box>
												)}
											</Box>
										)}
									</DropZone>
								</TabPanel>
								{/* //! Resources for task */}
								<TabPanel>
									<Box>
										<Text>Select a resource to use on this task</Text>
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
