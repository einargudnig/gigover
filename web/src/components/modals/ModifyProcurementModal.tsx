import React, { useState } from 'react';
import { Tender } from '../../models/Tender';
import {
	Checkbox,
	Box,
	Heading,
	VStack,
	FormControl,
	FormLabel,
	Input,
	Flex,
	Text,
	HStack
} from '@chakra-ui/react';
import { FormActions } from '../FormActions';
import { useCloseModal } from '../../hooks/useCloseModal';
import { useQueryClient } from 'react-query';
import { DatePicker } from '../forms/DatePicker';
import { Controller, useForm } from 'react-hook-form';
import { useModifyTender, ProjectFormData } from '../../mutations/procurement/useModifyTender';
import { ApiService } from '../../services/ApiService';
import { devError } from '../../utils/ConsoleUtils';
import { LoadingSpinner } from '../LoadingSpinner';
import { CalendarIcon } from '../icons/Calendar';

interface TenderModalProps {
	tender?: Tender;
}

export const ModifyProcurementModal = ({ tender }: TenderModalProps): JSX.Element => {
	const closeModal = useCloseModal();
	const queryClient = useQueryClient();

	const { mutate: modify, isLoading, isError, error } = useModifyTender();
	const {
		register,
		handleSubmit,
		control,
		formState: { errors }
	} = useForm<ProjectFormData>({
		defaultValues: tender,
		mode: 'onBlur'
	});

	// For the checkbox
	const [isChecked, setIsChecked] = useState(tender!.delivery);
	const handleChangeCheckbox = (event: React.ChangeEvent<HTMLInputElement>) => {
		const newValue = event.target.checked ? 1 : 0;
		setIsChecked(newValue);
	};

	const currentDate = new Date(); // To help with validation for the datePicker

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
					<Box mb={6} />
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
							// defaultValue={
							// 	project?.endDate ? new Date(project.endDate) : null
							// }
							render={({ field: { onChange, value, onBlur } }) => (
								<HStack>
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
							value={isChecked}
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
						submitText={isLoading ? <LoadingSpinner /> : 'Update'}
						onSubmit={onSubmit}
					/>
				</VStack>
			</form>
		</div>
	);
};
