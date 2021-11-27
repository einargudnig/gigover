import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Modal } from '../Modal';
import { MilestoneModalContext } from '../../context/ModalContext';
import { useCloseModal } from '../../hooks/useCloseModal';
import {
	Center,
	FormControl,
	FormErrorMessage,
	FormHelperText,
	FormLabel,
	HStack,
	Input,
	Textarea
} from '@chakra-ui/react';
import { MilestoneForm } from '../../models/Milestone';
import { DatePicker } from '../forms/DatePicker';
import { FormActions } from '../FormActions';
import { useAddMilestone } from '../../mutations/useAddMilestone';
import { devError } from '../../utils/ConsoleUtils';
import { Task, TaskStatus } from '../../models/Task';
import { useProjectDetails } from '../../queries/useProjectDetails';
import { LoadingSpinner } from '../LoadingSpinner';
import { Options } from '../forms/Options';
import { displayTaskTitle } from '../../utils/TaskUtils';

interface MilestoneModalProps {
	context: MilestoneModalContext;
}

export const MilestoneModal = ({ context }: MilestoneModalProps): JSX.Element => {
	const { projectId, milestone, callback } = context;
	const { data, isLoading: isLoadingProject } = useProjectDetails(projectId);
	const closeModal = useCloseModal(callback);
	const { register, handleSubmit, errors, control, reset } = useForm<MilestoneForm>({
		defaultValues: milestone ? milestone.milestoneJson : undefined,
		mode: 'onChange',
		reValidateMode: 'onBlur'
	});
	const { mutateAsync: addMilestone, isLoading, isError, error } = useAddMilestone();
	const tasks = data?.project?.tasks.filter((t) => t.status !== TaskStatus.Archived) ?? [];

	const onSubmit = handleSubmit(async (values) => {
		try {
			const res = await addMilestone({
				...values,
				estimatedHours: 0, // TODO should be removed from backend
				milestoneId: milestone?.milestoneId ?? undefined,
				projectId: milestone?.projectId ?? projectId
			});

			// eslint-disable-next-line no-console
			if (res?.id) {
				reset();
				closeModal();
			} else {
				throw new Error('Could not create a deliverable, please try again.');
			}
		} catch (e) {
			devError('addMilestone', e);
			// DO SOMETHING?
		}
	});

	return (
		<Modal
			title={milestone ? 'Edit deliverable' : 'Create deliverable'}
			open={true}
			onClose={() => closeModal()}
		>
			{isLoadingProject ? (
				<Center spacing={8}>
					<LoadingSpinner />
				</Center>
			) : (
				<>
					<div>
						{isError && (
							<>
								{/* Server errors */}
								<p>{error?.errorText}</p>
								<small>{error?.errorCode}</small>
							</>
						)}
					</div>
					<form onSubmit={onSubmit}>
						<FormControl
							id={'title'}
							isRequired
							isInvalid={Boolean(errors.title)}
							mb={6}
						>
							<FormLabel>Title</FormLabel>
							<Input
								type={'text'}
								name={'title'}
								ref={register({
									required: 'You have to set a title for the project deliverable'
								})}
							/>
							{errors.title ? (
								<FormErrorMessage>{errors.title.message}</FormErrorMessage>
							) : (
								<FormHelperText>
									Give your project deliverable a descriptive name
								</FormHelperText>
							)}
						</FormControl>
						<FormControl id={'description'} mb={6}>
							<FormLabel>Description</FormLabel>
							<Textarea name={'description'} ref={register} />
						</FormControl>
						<FormControl isRequired isInvalid={true} mb={6}>
							<FormLabel htmlFor="startDate">Start and end date</FormLabel>
							<HStack>
								<Controller
									name="startDate"
									control={control}
									defaultValue={
										milestone?.startDate ? new Date(milestone.startDate) : null
									}
									rules={{
										required: 'You have to set a start date'
									}}
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
								<Controller
									name="endDate"
									control={control}
									defaultValue={
										milestone?.endDate ? new Date(milestone.endDate) : null
									}
									rules={{
										required: 'You have to set an end date'
									}}
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
							</HStack>
							{errors.startDate || errors.endDate ? (
								<FormErrorMessage>
									{errors.startDate?.message || errors.endDate?.message}
								</FormErrorMessage>
							) : (
								<FormHelperText>
									When is the estimated start and end date of this project
									deliverable?
								</FormHelperText>
							)}
						</FormControl>
						<FormControl id={'milestoneTasks'}>
							<FormLabel>Tasks</FormLabel>
							<Controller
								name={'projectTasks'}
								control={control}
								render={({ onChange, value, onBlur }) => (
									<Options
										isMulti={true}
										onBlur={onBlur}
										onChange={(v: number) => onChange(v)}
										value={value}
										getOptionLabel={(option: Task) => displayTaskTitle(option)}
										getOptionValue={(option: Task) => option.taskId}
										options={tasks}
									/>
								)}
							/>
						</FormControl>
						<FormActions
							submitText={'Save'}
							onSubmit={onSubmit}
							submitLoading={isLoading}
							submitDisabled={isLoading}
							cancelDisabled={isLoading}
							cancelText={'Cancel'}
							onCancel={() => closeModal()}
						/>
					</form>
				</>
			)}
		</Modal>
	);
};
