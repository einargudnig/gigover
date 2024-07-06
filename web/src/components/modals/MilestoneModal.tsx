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
import { Controller, useForm } from 'react-hook-form';
import { MilestoneModalContext } from '../../context/ModalContext';
import { useCloseModal } from '../../hooks/useCloseModal';
import { MilestoneForm } from '../../models/Milestone';
import { Task, TaskStatus } from '../../models/Task';
import { useAddMilestone } from '../../mutations/useAddMilestone';
import { useProjectDetails } from '../../queries/useProjectDetails';
import { devError } from '../../utils/ConsoleUtils';
import { displayTaskTitle } from '../../utils/TaskUtils';
import { FormActions } from '../FormActions';
import { LoadingSpinner } from '../LoadingSpinner';
import { Modal } from '../Modal';
import { DatePicker } from '../forms/DatePicker';
import { Options } from '../forms/Options';

interface MilestoneModalProps {
	context: MilestoneModalContext;
}

export const MilestoneModal = ({ context }: MilestoneModalProps): JSX.Element => {
	const { projectId, milestone, callback } = context;
	const { data, isLoading: isLoadingProject } = useProjectDetails(projectId);
	const closeModal = useCloseModal(callback);
	const {
		register,
		handleSubmit,
		formState: { errors },
		control,
		reset
	} = useForm<MilestoneForm>({
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
				<Center m={'4'}>
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
								{...register('title', {
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
							<Textarea {...register('description')} />
						</FormControl>
						<FormControl isRequired isInvalid={true} mb={6}>
							<FormLabel htmlFor="startDate">Start and end date</FormLabel>
							<HStack>
								<Controller
									name="startDate"
									control={control}
									defaultValue={
										milestone?.startDate
											? (milestone.startDate.valueOf() as number)
											: undefined
									}
									rules={{
										required: 'You have to set a start date'
									}}
									render={({ field: { onChange, value, onBlur } }) => (
										<DatePicker
											selected={value ? new Date(value) : null}
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
										milestone?.endDate
											? (milestone.endDate.valueOf() as number)
											: undefined
									}
									rules={{
										required: 'You have to set an end date'
									}}
									render={({ field: { onChange, value, onBlur } }) => (
										<DatePicker
											selected={value ? new Date(value) : null}
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
								render={({ field: { onChange, value, onBlur } }) => (
									<Options
										isMulti={true}
										onBlur={onBlur}
										onChange={(newValue) => {
											const v = newValue as Task;
											onChange(v);
										}}
										value={value}
										getOptionValue={(option: unknown) =>
											option as Task as unknown as string
										}
										getOptionLabel={(option: unknown) =>
											displayTaskTitle(option as Task)
										}
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
