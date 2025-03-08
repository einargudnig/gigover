import { CalendarIcon } from '@chakra-ui/icons';
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
import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useQueryClient } from 'react-query';
import { DatePicker } from '../../../../components/forms/DatePicker';
import { useOpenProjects } from '../../../../hooks/useAvailableProjects';
import { Task } from '../../../../models/Task';
import { TenderBase } from '../../../../models/Tender';
import { TenderFormData, useAddTender } from '../../../../mutations/procurement/useAddTender';
import { useProjectList } from '../../../../queries/useProjectList';
import { ApiService } from '../../../../services/ApiService';
import { devError } from '../../../../utils/ConsoleUtils';

interface CreateTenderProps {
	onTenderCreate: (tenderId: number) => void;
}

export function CreateTender({ onTenderCreate }: CreateTenderProps) {
	const queryClient = useQueryClient();
	const { data, isLoading: isLoadingProjects } = useProjectList();
	const openProjects = useOpenProjects(data);
	const toast = useToast();
	const currentDate = new Date();

	// State
	const [selectedProject, setSelectedProject] = useState<number | null>(null);
	const [selectedProjectName, setSelectedProjectName] = useState<string>('');
	const [selectedTask, setSelectedTask] = useState<number | null>(null);
	const [isChecked, setIsChecked] = useState<number>(0);

	// Mutations
	const { mutate, isLoading } = useAddTender({
		onSuccess: (tenderId) => {
			// Here you get the tender ID as a number
			console.log('Created tender with ID:', tenderId);
			onTenderCreate(tenderId);
			queryClient.refetchQueries(ApiService.userTenders);
		},
		onError: (error) => {
			devError('Error creating tender:', error);
			toast({
				title: 'Error creating tender',
				description: 'Could not create tender. Please try again.',
				status: 'error',
				duration: 5000
			});
		}
	});

	// Form setup
	const {
		register,
		handleSubmit,
		formState: { errors },
		control
	} = useForm<TenderFormData>({
		defaultValues: {
			description: '',
			terms: '',
			finishDate: 0,
			delivery: 0,
			address: '',
			phoneNumber: ''
		},
		mode: 'onBlur'
	});

	// Handlers
	const handleProjectSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const projectId = parseInt(e.target.value);
		setSelectedProject(projectId);
		setSelectedProjectName(
			openProjects?.find((project) => project.projectId === projectId)?.name ?? ''
		);
	};

	const handleTaskSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const taskId = parseInt(e.target.value);
		setSelectedTask(taskId);
	};

	const handleChangeCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
		setIsChecked(e.target.checked ? 1 : 0);
	};

	// Form submission
	const onSubmit = handleSubmit((formData) => {
		if (!selectedProject || !selectedTask) {
			toast({
				title: 'Missing required fields',
				description: 'Please select both a project and a task.',
				status: 'warning',
				duration: 3000
			});
			return;
		}

		const tenderData: TenderBase = {
			projectId: selectedProject,
			projectName: selectedProjectName,
			taskId: selectedTask,
			description: formData.description,
			terms: formData.terms,
			finishDate: formData.finishDate,
			delivery: isChecked,
			address: formData.address,
			phoneNumber: formData.phoneNumber,
			status: 0 // I should take this away maybe?? It doesn't exist until the tender is created
		};

		mutate(tenderData);
	});

	// Derived state
	const tasksFromSelectedProject = useMemo(() => {
		if (!selectedProject || !data) {
			return [];
		}
		const project = data.find((p) => p.projectId === selectedProject);
		return (
			project?.tasks?.filter(
				(task: Task) => task.status === 0 || task.status === 1 || task.status === 2
			) ?? []
		);
	}, [selectedProject, data]);

	if (!openProjects?.length) {
		return (
			<Box p={6} textAlign="center">
				<Heading size="md">No Projects Available</Heading>
				<Text mt={4}>You need to create a project before you can make a procurement.</Text>
			</Box>
		);
	}

	return (
		<Box backgroundColor="white" py={6} rounded="md">
			<Flex justifyContent="center">
				<Heading size="md">Create Tender</Heading>
			</Flex>

			<Box px={10} py={4}>
				<form onSubmit={onSubmit}>
					<VStack spacing={6} align="stretch">
						<FormControl isInvalid={!!errors.projectId}>
							<FormLabel>Select a Project</FormLabel>
							<Select
								placeholder="Select a project"
								onChange={handleProjectSelect}
								value={selectedProject ?? ''}
							>
								{openProjects.map((project) => (
									<option key={project.projectId} value={project.projectId}>
										{project.name}
									</option>
								))}
							</Select>
						</FormControl>

						{selectedProject && (
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ duration: 0.3 }}
							>
								<FormControl>
									<FormLabel>Select a Task</FormLabel>
									<Select
										placeholder="Select a task"
										onChange={handleTaskSelect}
										value={selectedTask ?? ''}
									>
										{tasksFromSelectedProject.map((task) => (
											<option key={task.taskId} value={task.taskId}>
												{task.subject}
											</option>
										))}
									</Select>
								</FormControl>
							</motion.div>
						)}

						<Box mb={3} />
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
						<Box mb={3} />
						<FormControl id={'terms'} isInvalid={!!errors.terms}>
							<FormLabel>Terms</FormLabel>
							<Input
								placeholder={'Enter the terms of the procurement'}
								required={true}
								{...register('terms', { required: 'Terms are required' })}
							/>
							{errors.terms && <Text color="red.500">{errors.terms.message}</Text>}
						</FormControl>
						<Box mb={3} />
						<FormControl id={'finishDate'} isInvalid={!!errors.finishDate}>
							<Flex>
								<FormLabel>Close Date - </FormLabel>
								<Text>
									You will not be able to answer offers until this date has passed
								</Text>
							</Flex>
							<Controller
								name="finishDate"
								control={control}
								rules={{ required: 'Finish date is required' }}
								render={({ field }) => (
									<HStack>
										<DatePicker
											selected={field.value ? new Date(field.value) : null}
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
						<Box mb={3} />
						<FormControl id={'delivery'}>
							<FormLabel>Delivery</FormLabel>
							<Checkbox
								name="delivery"
								isChecked={isChecked === 1}
								onChange={handleChangeCheckbox}
							/>
						</FormControl>
						<Box mb={3} />
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
						<Box mb={3} />
						<FormControl id={'phoneNumber'} isInvalid={!!errors.phoneNumber}>
							<FormLabel>Phone Number</FormLabel>
							<Input
								placeholder={'Enter the phone number of the contact person'}
								required={true}
								{...register('phoneNumber', {
									required: 'Phone number is required',
									maxLength: {
										value: 10,
										message: 'Phone number cannot be more than 10 digits'
									}
								})}
							/>
							{errors.phoneNumber && (
								<Text color="red.500">{errors.phoneNumber.message}</Text>
							)}
						</FormControl>
						<Flex justify="flex-end" mt={4}>
							<Button
								type="submit"
								colorScheme={'black'}
								variant={'outline'}
								isLoading={isLoading}
								loadingText="Creating..."
							>
								Create Tender
							</Button>
						</Flex>
					</VStack>
				</form>
			</Box>
		</Box>
	);
}
