import React, { useState } from 'react';
import { ClientBid } from '../../models/Tender';
import {
	Box,
	Checkbox,
	FormControl,
	FormLabel,
	HStack,
	Heading,
	Input,
	VStack,
	Grid,
	GridItem,
	Text
} from '@chakra-ui/react';
import { FormActions } from '../FormActions';
import { useCloseModal } from '../../hooks/useCloseModal';
// import { useQueryClient } from 'react-query';
// import { DatePicker } from '../forms/DatePicker';
import { Controller, useForm } from 'react-hook-form';
import { DatePicker } from '../forms/DatePicker';
// import { useModifyTender, ProjectFormData } from '../../mutations/useModifyTender';
// import { ApiService } from '../../services/ApiService';
// import { devError } from '../../utils/ConsoleUtils';
// import { LoadingSpinner } from '../LoadingSpinner';

interface BidModalProps {
	bid?: ClientBid;
}

export const BidModal = ({ bid }: BidModalProps): JSX.Element => {
	console.log(bid);
	const closeModal = useCloseModal();
	// const queryClient = useQueryClient();

	// const { mutate: modify, isLoading, isError, error } = useModifyTender();
	const { register, control, handleSubmit } = useForm<ClientBid>({
		defaultValues: bid,
		mode: 'onBlur'
	});

	// For the checkbox
	const [isChecked, setIsChecked] = useState<number>(0);
	const handleChangeCheckbox = (event: React.ChangeEvent<HTMLInputElement>) => {
		const newValue = event.target.checked ? 1 : 0;
		setIsChecked(newValue);
	};

	const onSubmit = handleSubmit(
		async ({ description, terms, address, finishDate, bidder, client }) => {
			console.log(description, terms, address, finishDate, bidder, client);
		}
	);

	return (
		<div>
			<form onSubmit={onSubmit}>
				<VStack mb={-6} align={'stretch'}>
					<Text>Here you can create a bid and send to the bidder.</Text>
					<FormControl id={'description'}>
						<FormLabel>Description</FormLabel>
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
							{...register('terms', {
								required: 'Terms are required'
							})}
						/>
					</FormControl>
					<FormControl id={'address'}>
						<FormLabel>Address</FormLabel>
						<Input
							required={true}
							{...register('address', {
								required: 'Address is required'
							})}
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
					<FormControl id={'finishDate'}>
						<FormLabel>Bid valid through</FormLabel>
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
									selected={value ? new Date(value) : null}
									onBlur={onBlur}
								/>
							)}
						/>
					</FormControl>
					<hr />
					<HStack>
						<Grid templateColumns="repeat(4, 1fr)" gap={2} width={'full'}>
							<GridItem colSpan={2}>
								<HStack mb={3}>
									<Heading size={'md'}>Bidder</Heading>
									<Text>- You are sending the bid to this bidder</Text>
								</HStack>
								<FormControl>
									<FormLabel>Email</FormLabel>
									<Input
										required={true}
										{...register('bidder.email', {
											required: 'Company is required'
										})}
									/>
								</FormControl>
								<FormControl>
									<FormLabel>Company</FormLabel>
									<Input
										required={true}
										{...register('bidder.company', {
											required: 'Company is required'
										})}
									/>
								</FormControl>
								<FormControl>
									<FormLabel>Address</FormLabel>
									<Input
										required={true}
										{...register('bidder.address', {
											required: 'Company is required'
										})}
									/>
								</FormControl>
								<FormControl>
									<FormLabel>Phone</FormLabel>
									<Input
										required={true}
										{...register('bidder.phoneNumber', {
											required: 'Company is required'
										})}
									/>
								</FormControl>
								<FormControl>
									<FormLabel>Company Id</FormLabel>
									<Input
										required={true}
										{...register('bidder.companyId', {
											required: 'Company is required'
										})}
									/>
								</FormControl>
							</GridItem>
							<GridItem colSpan={2}>
								<HStack mb={3}>
									<Heading size={'md'}>Client</Heading>
									<Text>- You are creating the bid</Text>
								</HStack>
								<FormControl>
									<FormLabel>Client number</FormLabel>
									<Input
										required={true}
										{...register('client.clientNumber', {
											required: 'Company is required'
										})}
									/>
								</FormControl>
								<FormControl>
									<FormLabel>Client address</FormLabel>
									<Input
										required={true}
										{...register('client.address', {
											required: 'Company is required'
										})}
									/>
								</FormControl>
								<FormControl>
									<FormLabel>Client phone</FormLabel>
									<Input
										required={true}
										{...register('client.phoneNumber', {
											required: 'Company is required'
										})}
									/>
								</FormControl>
								<FormControl>
									<FormLabel>Client email</FormLabel>
									<Input
										required={true}
										{...register('client.email', {
											required: 'Company is required'
										})}
									/>
								</FormControl>
								<FormControl>
									<FormLabel>Other</FormLabel>
									<Input
										required={true}
										{...register('client.other', {
											required: 'Company is required'
										})}
									/>
								</FormControl>
							</GridItem>
						</Grid>
					</HStack>
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
