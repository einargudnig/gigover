import React, { useState } from 'react';
import { Tender } from '../../models/Tender';
import { Checkbox, Box, Heading, VStack, FormControl, FormLabel, Input } from '@chakra-ui/react';
import { FormActions } from '../FormActions';
import { useCloseModal } from '../../hooks/useCloseModal';
import { useQueryClient } from 'react-query';
import { DatePicker } from '../forms/DatePicker';
import { Controller, useForm } from 'react-hook-form';
import { useModifyTender, ProjectFormData } from '../../mutations/useModifyTender';
import { ApiService } from '../../services/ApiService';
import { devError } from '../../utils/ConsoleUtils';
import { LoadingSpinner } from '../LoadingSpinner';

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
						<FormLabel>Close Date</FormLabel>
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
						submitText={isLoading ? <LoadingSpinner /> : 'Update'}
						onSubmit={onSubmit}
					/>
				</VStack>
			</form>
		</div>
	);
};
