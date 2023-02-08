import React, { useState } from 'react';
import { Tender } from '../../models/Tender';
import { Box, Heading, Text, VStack, FormControl, FormLabel, Input } from '@chakra-ui/react';
import { FormActions } from '../FormActions';
import { useCloseModal } from '../../hooks/useCloseModal';
import { useQueryClient } from 'react-query';
import { DatePicker } from '../forms/DatePicker';
import { Controller, useForm } from 'react-hook-form';
import { useModifyTender, ProjectFormData } from '../../mutations/useModifyTender';
import { ApiService } from '../../services/ApiService';
import { devError } from '../../utils/ConsoleUtils';

interface TenderModalProps {
	tender?: Tender;
}

export const ModifyProcurementModal = ({ tender }: TenderModalProps): JSX.Element => {
	const closeModal = useCloseModal();
	const queryClient = useQueryClient();

	const { mutate: modify, isLoading, isError, error } = useModifyTender();
	const { register, handleSubmit, errors, control } = useForm<ProjectFormData>({
		defaultValues: tender,
		mode: 'onBlur'
	});

	const onSubmit = handleSubmit(
		async ({ description, terms, finishDate, delivery, address, phoneNumber }) => {
			try {
				await modify({
					tenderId: tender?.tenderId,
					description,
					terms,
					finishDate,
					delivery,
					address,
					phoneNumber
				});
				console.log('success');

				// queryClient.refetchQueries(ApiService.addTender); //! should we refetch the useTenders/id query?
				closeModal();
			} catch (e) {
				devError('Error', e);
			}
		}
	);

	//! I htink I should not be able as a user, to update the task and the project.
	// So for the time being I'll leave it out of the modified modal.
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
					<Heading size={'md'}>Project</Heading>
					{/* {openProjects ? (
						<>
							<FormControl id={'project'}>
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
					)} */}
					{/* {selectedProject && (
						<>
							<FormControl id={'task'}>
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
							</FormControl>
						</>
					)} */}
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
