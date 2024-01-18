import React, { useState } from 'react';
import { Tender } from '../../models/Tender';
import {
	Checkbox,
	Box,
	Heading,
	Text,
	VStack,
	FormControl,
	FormLabel,
	Input,
	Flex,
	useToast,
	HStack
} from '@chakra-ui/react';
import { FormActions } from '../FormActions';
import { useOpenProjects } from '../../hooks/useAvailableProjects';
import { TrackerSelect } from '../TrackerSelect';
import { useProjectList } from '../../queries/useProjectList';
import { useCloseModal } from '../../hooks/useCloseModal';
import { useQueryClient } from 'react-query';
import { ApiService } from '../../services/ApiService';
import { DatePicker } from '../forms/DatePicker';
import { Controller, useForm } from 'react-hook-form';
import { useAddTender, TenderFormData } from '../../mutations/procurement/useAddTender';
import { devError } from '../../utils/ConsoleUtils';
import { Task } from '../../models/Task';
import { CalendarIcon } from '../icons/Calendar';

interface TenderModalProps {
	tender?: Tender;
}

export const ProcurementModal = ({ tender }: TenderModalProps): JSX.Element => {
	const closeModal = useCloseModal();
	const queryClient = useQueryClient();
	const { data } = useProjectList();
	// I'm using the openProjects for the selecting of projects.
	const openProjects = useOpenProjects(data);
	const toast = useToast();
	// This is so the user can select a project and then the tasks from the selected project.
	// we want the procurement to be linked to a task and a project.
	const [selectedProject, setSelectedProject] = useState<number | undefined>(tender?.projectId);
	const [selectedProjectName, setSelectedProjectName] = useState<string | undefined>(
		tender?.projectName
	);
	const [selectedTask, setSelectedTask] = useState<number | undefined>(tender?.taskId);

	// mustateAsync: modify
	const { mutate: modify, isError, error } = useAddTender();
	const {
		register,
		handleSubmit,
		formState: { errors },
		control
	} = useForm<TenderFormData>({
		defaultValues: tender,
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
				console.log('response', response);

				queryClient.refetchQueries(ApiService.userTenders);
				closeModal();
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
		<div>
			{isError && (
				<>
					{/* Server errors */}
					<p>{error?.errorText}</p>
					<small>{error?.errorCode}</small>
				</>
			)}
			<form onSubmit={onSubmit}>
				<VStack mb={-6} align={'stretch'}>
					{openProjects ? (
						<>
							<FormControl id={'projectIds'} isInvalid={!!errors.projectId}>
								<Heading size={'md'}>Select a project for your procurement</Heading>
								<TrackerSelect
									title={'Select a project'}
									value={selectedProject}
									options={openProjects.map((project) => ({
										label: project.name,
										value: project.projectId
									}))}
									valueChanged={(newValue) => {
										if (newValue === '') {
											setSelectedProject(undefined);
										} else {
											setSelectedProject((newValue as number) ?? undefined);
											setSelectedProjectName(
												openProjects.find(
													(project) =>
														project.projectId === (newValue as number)
												)?.name
											);
										}
									}}
								/>
							</FormControl>
						</>
					) : (
						<>
							<Heading>No projects</Heading>
							<Text>
								You do not have any projects, you have to create a project before
								you can make a procurement
							</Text>
						</>
					)}
					{selectedProject && (
						<>
							<Heading size={'md'}>Select a task for your procurement</Heading>
							<TrackerSelect
								title={'Select a task'}
								value={selectedTask}
								options={activeTasks(tasksFromSelectedProject)!.map((task) => ({
									label: task.subject,
									value: task.taskId
								}))}
								valueChanged={(newValue) => {
									if (newValue === '') {
										setSelectedTask(undefined);
									} else {
										setSelectedTask((newValue as number) ?? undefined);
									}
								}}
							/>
						</>
					)}
					<FormControl id={'description'} isInvalid={!!errors.description}>
						<FormLabel>Procurement Description</FormLabel>
						<Input
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
							required={true}
							{...register('terms', { required: 'Terms are required' })}
						/>
						{errors.terms && <Text color="red.500">{errors.terms.message}</Text>}
					</FormControl>
					<Box width={['50%', '33%']} mb={6} />
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
							render={({ field: { onChange, onBlur, value } }) => (
								<HStack>
									<DatePicker
										onChange={(date) => {
											if (date) {
												onChange((date as Date).getTime());
											} else {
												onChange(null);
											}
										}}
										selected={value ? new Date(value) : null}
										onBlur={onBlur}
										minDate={currentDate}
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
							required={true}
							{...register('address', { required: 'Address is required' })}
						/>
						{errors.address && <Text color="red.500">{errors.address.message}</Text>}
					</FormControl>
					<Box mb={6} />
					<FormControl id={'phoneNumber'} isInvalid={!!errors.phoneNumber}>
						<FormLabel>Phone Number</FormLabel>
						<Input
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
					<FormActions
						cancelText={'Cancel'}
						onCancel={closeModal}
						submitText={'Create'}
						onSubmit={onSubmit}
					/>
				</VStack>
			</form>
		</div>
	);
};
