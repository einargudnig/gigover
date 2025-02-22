import {
	Box,
	Button,
	Checkbox,
	Flex,
	FormControl,
	FormLabel,
	HStack,
	Heading,
	Input,
	Select,
	Text,
	VStack,
	useToast
} from '@chakra-ui/react';
import { TenderFormData, useAddTender } from '../../../../mutations/procurement/useAddTender';
import { Controller, useForm } from 'react-hook-form';
import { CalendarIcon } from '@chakra-ui/icons';
import { DatePicker } from '../../../../components/forms/DatePicker';
import { useState } from 'react';
import { useQueryClient } from 'react-query';
import { useOpenProjects } from '../../../../hooks/useAvailableProjects';
import { useProjectList } from '../../../../queries/useProjectList';
import { ApiService } from '../../../../services/ApiService';
import { devError } from '../../../../utils/ConsoleUtils';
import { Task } from '../../../../models/Task';
import { motion } from 'framer-motion';

// Define a new type for tender creation
interface CreateTenderDTO {
	projectId: number | undefined;
	projectName: string;
	taskId: number;
	description: string;
	terms: string;
	finishDate: number;
	delivery: number;
	address: string;
	phoneNumber: string;
}

interface CreateTenderProps {
	onTenderCreate: (tender: CreateTenderDTO) => void;
}

export function CreateTender({ onTenderCreate }: CreateTenderProps) {
	const queryClient = useQueryClient();
	const { data } = useProjectList();
	// I'm using the openProjects for the selecting of projects.
	const openProjects = useOpenProjects(data);
	const toast = useToast();
	// This is so the user can select a project and then the tasks from the selected project.
	// we want the procurement to be linked to a task and a project.
	const [selectedProject, setSelectedProject] = useState<number | undefined>(undefined);
	const [selectedProjectName, setSelectedProjectName] = useState<string>('');
	const [selectedTask, setSelectedTask] = useState<number>(0);

	const { mutate: modify } = useAddTender();
	const {
		register,
		handleSubmit,
		formState: { errors },
		control
	} = useForm<TenderFormData>({
		defaultValues: {
			projectId: 1,
			projectName: '',
			taskId: 1,
			description: '',
			terms: '',
			finishDate: 0,
			delivery: 0,
			address: '',
			phoneNumber: ''
		},
		mode: 'onBlur'
	});

	// For the checkbox
	const [isChecked, setIsChecked] = useState<number>(0);
	const handleChangeCheckbox = (event: React.ChangeEvent<HTMLInputElement>) => {
		const newValue = event.target.checked ? 1 : 0;
		setIsChecked(newValue);
	};

	const currentDate = new Date(); // To help with validation for the datePicker

	// We want to find the tasks from the selected project so the user can select a task.
	// selectedProject as a parameter
	const findTasks = (projectId: number) => {
		const taskFromProject = data?.find((project) => project.projectId === projectId);
		return taskFromProject?.tasks;
	};
	//! I need to filer away the tasks that are not open.
	const tasksFromSelectedProject = findTasks(selectedProject ?? 0);

	const activeTasks = (tasks) => {
		return tasks?.filter(
			(task: Task) => task.status === 0 || task.status === 1 || task.status === 2
		);
	};

	const onSubmit = handleSubmit(
		async ({ description, terms, finishDate, address, phoneNumber }) => {
			console.log(
				selectedProject,
				selectedProjectName,
				selectedTask,
				description,
				terms,
				finishDate,
				address,
				phoneNumber
			);
			try {
				const response = modify({
					projectId: selectedProject,
					projectName: selectedProjectName, // this should set the projectName to the mutation!
					taskId: selectedTask,
					description,
					terms,
					finishDate,
					delivery: isChecked,
					address,
					phoneNumber
				});
				console.log('success');
				onTenderCreate({
					projectId: selectedProject,
					projectName: selectedProjectName, // this should set the projectName to the mutation!
					taskId: selectedTask,
					description,
					terms,
					finishDate,
					delivery: isChecked,
					address,
					phoneNumber
				});
				console.log('response', response);

				queryClient.refetchQueries(ApiService.userTenders);
			} catch (e) {
				devError('Error YES?', e);
				toast({
					title: 'Invalid tender!',
					description: 'You could not add the Tender! There is an error.',
					status: 'error',
					duration: 3000,
					isClosable: true
				});
			}
		}
	);

	return (
		<Box backgroundColor={'white'} py={6} rounded={'md'}>
			<Flex justifyContent={'center'}>
				<Heading size={'md'}>Create Tender</Heading>
			</Flex>
			<Box px={10} py={4}>
				<form onSubmit={onSubmit}>
					<VStack mb={-6} align={'stretch'}>
						{/* We should have everything conditionally rendered here, you cannot create a tender unless you have an open project! */}
						{openProjects ? (
							<Box marginBottom={8}>
								<FormControl id={'projectIds'} isInvalid={!!errors.projectId}>
									<FormLabel>Select a project</FormLabel>
									<Select
										placeholder="Select a project"
										onChange={(e) => {
											const projectId = e.target.value;
											setSelectedProject(parseInt(projectId));
											setSelectedProjectName(
												openProjects.find(
													(project) =>
														project.projectId === parseInt(projectId)
												)?.name || ''
											);
										}}
									>
										{openProjects.map((project) => (
											<option
												key={project.projectId}
												value={project.projectId}
											>
												{project.name}
											</option>
										))}
									</Select>
								</FormControl>

								<Box mb={6} />

								{selectedProject && (
									<Box
										as={motion.div}
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										transition="0.8"
									>
										<FormControl>
											<FormLabel>Select a task</FormLabel>
											<Select
												placeholder="Select a task"
												onChange={(e) => {
													const taskId = e.target.value;
													setSelectedTask(parseInt(taskId));
												}}
											>
												{activeTasks(tasksFromSelectedProject)!.map(
													(task) => (
														<option
															key={task.taskId}
															value={task.taskId}
														>
															{task.subject}
														</option>
													)
												)}
											</Select>
										</FormControl>

										<Box mb={6} />
									</Box>
								)}
								<FormControl id={'description'} isInvalid={!!errors.description}>
									<FormLabel>Procurement Description</FormLabel>
									<Input
										placeholder={'Enter a description of the procurement'}
										required={true}
										{...register('description', {
											required: 'Procurement description is required'
										})}
									/>
									{errors.description && (
										<Text color="red.500">{errors.description.message}</Text>
									)}
								</FormControl>
								<Box mb={6} />
								<FormControl id={'terms'} isInvalid={!!errors.terms}>
									<FormLabel>Terms</FormLabel>
									<Input
										placeholder={'Enter the terms of the procurement'}
										required={true}
										{...register('terms', { required: 'Terms are required' })}
									/>
									{errors.terms && (
										<Text color="red.500">{errors.terms.message}</Text>
									)}
								</FormControl>
								<Box width={['50%', '33%']} mb={6} />
								<FormControl id={'finishDate'} isInvalid={!!errors.finishDate}>
									<Flex>
										<FormLabel>Close Date - </FormLabel>
										<Text>
											You will not be able to answer offers until this date
											has passed
										</Text>
									</Flex>
									<Controller
										name="finishDate"
										control={control}
										rules={{ required: 'Finish date is required' }}
										render={({ field }) => (
											<HStack>
												<DatePicker
													selected={
														field.value ? new Date(field.value) : null
													}
													onChange={(date: Date | null) => {
														if (date) {
															// Ensure we're setting the full timestamp
															field.onChange(date.getTime());
														} else {
															field.onChange(null);
														}
													}}
													onBlur={field.onBlur}
													minDate={currentDate}
													dateFormat="dd/MM/yyyy" // Add this to ensure proper date format display
													required={true}
													placeholderText="Select date" // Optional: adds placeholder text
												/>
												<CalendarIcon color={'black'} />
											</HStack>
										)}
									/>
									{errors.finishDate && (
										<Text color="red.500">{errors.finishDate.message}</Text>
									)}
								</FormControl>
								<Box mb={6} />
								<FormControl id={'delivery'}>
									<FormLabel>Delivery</FormLabel>
									<Checkbox
										name="delivery"
										isChecked={isChecked === 1}
										onChange={handleChangeCheckbox}
									/>
								</FormControl>
								<Box mb={6} />
								<FormControl id={'address'} isInvalid={!!errors.address}>
									<FormLabel>Address - contact person on site</FormLabel>
									<Input
										placeholder={'Enter the address of the procurement'}
										required={true}
										{...register('address', {
											required: 'Address is required'
										})}
									/>
									{errors.address && (
										<Text color="red.500">{errors.address.message}</Text>
									)}
								</FormControl>
								<Box mb={6} />
								<FormControl id={'phoneNumber'} isInvalid={!!errors.phoneNumber}>
									<FormLabel>Phone Number</FormLabel>
									<Input
										placeholder={'Enter the phone number of the contact person'}
										required={true}
										{...register('phoneNumber', {
											required: 'Phone number is required',
											maxLength: {
												value: 10,
												message:
													'Phone number cannot be more than 10 digits'
											}
										})}
									/>
									{errors.phoneNumber && (
										<Text color="red.500">{errors.phoneNumber.message}</Text>
									)}
								</FormControl>
							</Box>
						) : (
							<>
								<Heading>No projects</Heading>
								<Text>
									You do not have any projects, you have to create a project
									before you can make a procurement
								</Text>
							</>
						)}
					</VStack>
					<Flex justifyContent={'end'} marginTop={2}>
						<Button type="submit">Create</Button>
					</Flex>
				</form>
			</Box>
		</Box>
	);
}
