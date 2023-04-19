import React, { useState } from 'react';
import { Tender } from '../../models/Tender';
import {
	Checkbox,
	Box,
	Divider,
	Heading,
	VStack,
	FormControl,
	FormLabel,
	Input
} from '@chakra-ui/react';
import { FormActions } from '../FormActions';
import { useCloseModal } from '../../hooks/useCloseModal';
import { useQueryClient } from 'react-query';
import { DatePicker } from '../forms/DatePicker';
import { Controller, useForm } from 'react-hook-form';
import { useModifyTender, ProjectFormData } from '../../mutations/useModifyTender';
import { ApiService } from '../../services/ApiService';
import { devError } from '../../utils/ConsoleUtils';
import { LoadingSpinner } from '../LoadingSpinner';
import { InviteBidder } from '../InviteUser/InviteBidder';

interface TenderModalProps {
	tender?: Tender;
}

export const ModifyProcurementModal = ({ tender }: TenderModalProps): JSX.Element => {
	const closeModal = useCloseModal();
	const queryClient = useQueryClient();

	const { mutate: modify, isLoading, isError, error } = useModifyTender();
	const { register, handleSubmit, control } = useForm<ProjectFormData>({
		defaultValues: tender,
		mode: 'onBlur'
	});

	// For the checkbox
	const [isChecked, setIsChecked] = useState(tender!.delivery);
	const handleChangeCheckbox = (event: React.ChangeEvent<HTMLInputElement>) => {
		const newValue = event.target.checked ? 1 : 0;
		setIsChecked(newValue);
	};

	const onSubmit = handleSubmit(
		async ({ description, terms, finishDate, address, phoneNumber }) => {
			try {
				await modify({
					tenderId: tender!.tenderId,
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

	//! I think I should not be able as a user, to update the task and the project.
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
					{/* I intentionally lef the project and task out of the modify phase */}
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
							// defaultValue={
							// 	project?.endDate ? new Date(project.endDate) : null
							// }
							render={({ field: { onChange, value, onBlur } }) => (
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
						<Checkbox
							name="delivery"
							isChecked={isChecked === 1}
							onChange={handleChangeCheckbox}
							value={isChecked}
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
						submitText={isLoading ? <LoadingSpinner /> : 'Update'}
						onSubmit={onSubmit}
					/>
				</VStack>
			</form>
			<div>
				<Divider mt={'8'} mb={4} />
				<Heading size={'md'} mb={4}>
					Invite users to {tender!.description}
				</Heading>
				<InviteBidder tenderId={tender!.tenderId} />
			</div>
		</div>
	);
};
