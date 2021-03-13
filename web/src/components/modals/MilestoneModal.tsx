import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Modal } from '../Modal';
import { MilestoneModalContext } from '../../context/ModalContext';
import { useCloseModal } from '../../hooks/useCloseModal';
import {
	Box,
	FormControl,
	FormErrorMessage,
	FormHelperText,
	FormLabel,
	HStack,
	Input,
	NumberDecrementStepper,
	NumberIncrementStepper,
	NumberInput,
	NumberInputField,
	NumberInputStepper,
	Textarea
} from '@chakra-ui/react';
import { MilestoneForm } from '../../models/Milestone';
import { DatePicker } from '../forms/DatePicker';
import { FormActions } from '../FormActions';
import { useAddMilestone } from '../../mutations/useAddMilestone';
import { devError } from '../../utils/ConsoleUtils';

interface MilestoneModalProps {
	context: MilestoneModalContext;
}

export const MilestoneModal = ({ context }: MilestoneModalProps): JSX.Element => {
	const { projectId, milestone, callback } = context;
	const closeModal = useCloseModal(callback);
	const { register, handleSubmit, errors, control, reset } = useForm<MilestoneForm>({
		defaultValues: milestone ? milestone.milestoneJson : undefined,
		mode: 'onChange',
		reValidateMode: 'onBlur'
	});
	const { mutateAsync: addMilestone, isError, error } = useAddMilestone();

	const onSubmit = handleSubmit(async (values) => {
		try {
			const res = await addMilestone({
				...values,
				milestoneId: milestone?.milestoneId ?? undefined,
				projectId: milestone?.projectId ?? projectId
			});

			// eslint-disable-next-line no-console
			if (res?.id) {
				reset();
				closeModal();
			} else {
				throw new Error('Could not create a milestone, please try again.');
			}
		} catch (e) {
			devError('addMilestone', e);
			// DO SOMETHING?
		}
	});

	return (
		<Modal
			title={milestone ? 'Edit milestone' : 'Create milestone'}
			open={true}
			onClose={() => closeModal()}
		>
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
				<FormControl id={'title'} isRequired isInvalid={Boolean(errors.title)}>
					<FormLabel>Title</FormLabel>
					<Input
						type={'text'}
						name={'title'}
						ref={register({ required: 'You have to set a title for the milestone' })}
					/>
					{errors.title ? (
						<FormErrorMessage>{errors.title.message}</FormErrorMessage>
					) : (
						<FormHelperText>Give your milestone a descriptive name</FormHelperText>
					)}
				</FormControl>
				<Box mb={6} />
				<FormControl id={'description'}>
					<FormLabel>Description</FormLabel>
					<Textarea name={'description'} ref={register} />
				</FormControl>
				<Box mb={6} />
				<FormControl isRequired isInvalid={true}>
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
							defaultValue={milestone?.endDate ? new Date(milestone.endDate) : null}
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
							When should this milestone start and be finished?
						</FormHelperText>
					)}
				</FormControl>
				<Box mb={6} />
				<FormControl id={'estimatedHours'}>
					<FormLabel>Estimated hours</FormLabel>
					<NumberInput min={1}>
						<NumberInputField
							name={'estimatedHours'}
							ref={register({ required: false })}
						/>
						<NumberInputStepper>
							<NumberIncrementStepper />
							<NumberDecrementStepper />
						</NumberInputStepper>
					</NumberInput>
					{errors.estimatedHours ? (
						<FormErrorMessage>{errors.estimatedHours}</FormErrorMessage>
					) : (
						<FormHelperText>
							What is the estimated hours to finish this milestone?
						</FormHelperText>
					)}
				</FormControl>
				<FormActions
					submitText={'Save'}
					onSubmit={onSubmit}
					cancelText={'Cancel'}
					onCancel={() => closeModal()}
				/>
			</form>
		</Modal>
	);
};
