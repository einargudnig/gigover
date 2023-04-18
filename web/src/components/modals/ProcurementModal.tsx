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
	Input
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
import { useAddTender, TenderFormData } from '../../mutations/useAddTender';
import { devError } from '../../utils/ConsoleUtils';
import { Task } from '../../models/Task';

interface TenderModalProps {
	tender?: Tender;
}

export const ProcurementModal = ({ tender }: TenderModalProps): JSX.Element => {
	const closeModal = useCloseModal();
	const queryClient = useQueryClient();
	const { data } = useProjectList();
	// I'm using the openProjects for the selecting of projects.
	const openProjects = useOpenProjects(data);

	// This is so the user can select a project and then the tasks from the selected project.
	// we want the procurement to be linked to a task and a project.
	const [selectedProject, setSelectedProject] = useState<number | undefined>(tender?.projectId);
	const [selectedTask, setSelectedTask] = useState<number | undefined>(tender?.taskId);

	// mustateAsync: modify
	const { mutate: modify, isError, error } = useAddTender();
	const { register, handleSubmit, control } = useForm<TenderFormData>({
		defaultValues: tender,
		mode: 'onBlur'
	});

	// For the checkbox
	const [isChecked, setIsChecked] = useState<number>(0);
	const handleChangeCheckbox = (event: React.ChangeEvent<HTMLInputElement>) => {
		const newValue = event.target.checked ? 1 : 0;
		setIsChecked(newValue);
	};

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
		async ({
			// eslint-disable-next-line
			projectId, //TODO Why is this underlined?
			// eslint-disable-next-line
			taskId, //TODO Why is this underlined?
			description,
			terms,
			finishDate,
			// eslint-disable-next-line
			delivery,
			address,
			phoneNumber
		}) => {
			try {
				await modify({
					projectId: selectedProject,
					taskId: selectedTask,
					description,
					terms,
					finishDate,
					delivery: isChecked,
					address,
					phoneNumber
				});
				console.log('success');

				queryClient.refetchQueries(ApiService.userTenders);
				closeModal();
			} catch (e) {
				devError('Error', e);
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
							<FormControl id={'modal'}>
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
					<FormControl id={'description'}>
						<FormLabel>Procurement Description</FormLabel>
						<Input
							required={true}
							{...register('description', {
								required: 'Procurement description is required'
							})}
						/>
					</FormControl>
					<Box mb={6} />
					<FormControl id={'terms'}>
						<FormLabel>Terms</FormLabel>
						<Input
							required={true}
							{...register('terms', { required: 'terms are required' })}
						/>
					</FormControl>
					<Box mb={6} />
					<FormControl id={'finishDate'}>
						<FormLabel>Close Date</FormLabel>
						<Controller
							name="finishDate"
							control={control}
							render={({ field: { onChange, onBlur, value } }) => (
								<DatePicker
									onChange={(date) => {
										if (date) {
											onChange((date as Date).getTime());
										} else {
											onChange(null);
										}
									}}
									selected={value}
									onBlur={onBlur}
								/>
							)}
						/>
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
					<FormControl id={'address'}>
						<FormLabel>Address - contact person on site</FormLabel>
						<Input
							required={true}
							{...register('address', { required: 'address is required' })}
						/>
					</FormControl>
					<Box mb={6} />
					<FormControl id={'phoneNumber'}>
						<FormLabel>Phone Number</FormLabel>
						<Input
							required={true}
							{...register('phoneNumber', { required: 'phone number is required' })}
						/>
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
