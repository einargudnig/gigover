import React, { useState } from 'react';
import { Tender } from '../../models/Tender';
import { Box, Heading, Text, VStack, FormControl, FormLabel, Input } from '@chakra-ui/react';
import styled from 'styled-components';
import { Modal } from '../Modal';
import { FormActions } from '../FormActions';
import { useOpenProjects } from '../../hooks/useAvailableProjects';
import { TrackerSelect } from '../TrackerSelect';
import { useProjectList } from '../../queries/useProjectList';
import { useCloseModal } from '../../hooks/useCloseModal';
import { useQueryClient } from 'react-query';
import { DatePicker } from '../forms/DatePicker';
import { Controller, useForm } from 'react-hook-form';
import { useAddTender, TenderFormData } from '../../mutations/useAddTender';
import { ApiService } from '../../services/ApiService';
import { devError } from '../../utils/ConsoleUtils';

interface TenderModalProps {
	tender?: Tender;
}

const ProcurementModalStyled = styled.div`
	@media screen and (max-width: 500px) {
		width: 500px;
	}
`;

const testData = {
	projectId: 1418, // Another test project
	taskId: 1646, // Hello, testingtesting
	description: 'test procurement',
	terms: 'test procurement',
	finishDate: 20210901,
	delivery: 1,
	address: 'dufnaholar 10',
	phoneNumber: '1234567'
};

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
	const { mutate: modify, isLoading, isError, error } = useAddTender();
	const { register, handleSubmit, errors, control } = useForm<TenderFormData>({
		defaultValues: tender,
		mode: 'onBlur'
	});

	// useEffect(() => {
	// 	if (selectedProject) {
	// 		mutateAsync({ projectId: selectedProject }).finally(() => null);
	// 	}
	// }, [mutateAsync, selectedProject]);

	// We want to finde the tasks from the selected project so the user can select a task.
	// selectedProject as a parameter
	const findTasks = (projectId: number) => {
		const taskFromProject = data?.find((project) => project.projectId === projectId);
		return taskFromProject?.tasks;
	};
	const tasksFromSelectedProject = findTasks(selectedProject ?? 0);
	// const taskNumbers = () => {
	// 	return tasksFromSelectedProject!.length;
	// };

	const onSubmit = handleSubmit(
		async ({
			projectId,
			taskId,
			description,
			terms,
			finishDate,
			delivery,
			address,
			phoneNumber
		}) => {
			try {
				await modify({
					projectId: selectedProject,
					taskId: 1646,
					description,
					terms,
					finishDate,
					delivery,
					address,
					phoneNumber
				});
				console.log('success');
				queryClient.refetchQueries(ApiService.addTender);
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
								options={tasksFromSelectedProject!.map((task) => ({
									label: task.text,
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
					{/* <form> */}
					{/* <FormControl id={'name'} isRequired>
								<FormLabel>Procurement name</FormLabel>
								<Input
									name="name"
									required={true}
									ref={register({ required: 'Procurement name is required' })}
								/>
							</FormControl>
							<Box mb={6} /> */}
					<FormControl id={'description'}>
						<FormLabel>Procurement Description</FormLabel>
						<Input
							name="description"
							required={true}
							ref={register({
								required: 'Procurement description is required'
							})}
						/>
					</FormControl>
					<Box mb={6} />
					<FormControl id={'terms'}>
						<FormLabel>Terms</FormLabel>
						<Input
							name="terms"
							required={true}
							ref={register({ required: 'terms are required' })}
						/>
					</FormControl>
					<Box mb={6} />
					<FormControl id={'finishDate'}>
						<FormLabel>Finish Date</FormLabel>
						<Controller
							name="finishDate"
							control={control}
							// defaultValue={
							// 	project?.endDate ? new Date(project.endDate) : null
							// }
							render={({ onChange, value, onBlur }) => (
								<DatePicker
									selected={value}
									onChange={(date) => {
										if (date) {
											onChange((date as Date).getTime());
										} else {
											onChange(null);
										}
									}}
									onBlur={onBlur}
								/>
							)}
						/>
					</FormControl>
					<Box mb={6} />
					<FormControl id={'delivery'}>
						<FormLabel>Delivery</FormLabel>
						<Input
							name="delivery"
							required={true}
							ref={register({ required: 'delivery is required' })}
						/>
					</FormControl>
					<Box mb={6} />
					<FormControl id={'address'}>
						<FormLabel>Address</FormLabel>
						<Input
							name="address"
							required={true}
							ref={register({ required: 'address is required' })}
						/>
					</FormControl>
					<Box mb={6} />
					<FormControl id={'phoneNumber'}>
						<FormLabel>Phone Number</FormLabel>
						<Input
							name="phoneNumber"
							required={true}
							ref={register({ required: 'phone number is required' })}
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
