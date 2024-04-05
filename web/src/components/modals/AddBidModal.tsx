import React, { useState } from 'react';
import { Bid } from '../../models/Tender';
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
	Text,
	useToast
} from '@chakra-ui/react';
import { FormActions } from '../FormActions';
import { useCloseModal } from '../../hooks/useCloseModal';
import { Controller, useForm } from 'react-hook-form';
import { DatePicker } from '../forms/DatePicker';
import { useAddBid } from '../../mutations/procurement/client-bids/useAddBid';
import { devError } from '../../utils/ConsoleUtils';

interface BidModalProps {
	bid?: Bid;
}

export const AddBidModal = ({ bid }: BidModalProps): JSX.Element => {
	console.log(bid);
	const closeModal = useCloseModal();

	const toast = useToast();

	const { mutate: addBid, isError, error } = useAddBid();
	const { register, control, handleSubmit } = useForm<Bid>({
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
		async ({ description, terms, address, finishDate, delivery, clientUId, notes }) => {
			console.log(description, terms, address, finishDate, delivery, clientUId, notes);
			try {
				const response = addBid({
					clientUId,
					description,
					terms,
					address,
					finishDate,
					delivery,
					notes
				});
				console.log('response', response);

				closeModal();
			} catch (e) {
				devError('Error', e);
				toast({
					title: 'Invalid bid!',
					description: 'You could not add the Bid! There is an error.',
					status: 'error',
					duration: 3000,
					isClosable: true
				});
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
					<Text>Here you can create a bid and send to the bidder.</Text>
					<FormControl id={'description'}>
						<FormLabel>Description</FormLabel>
						<Input
							required={true}
							{...register('description', {
								required: 'Bid description is required'
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
									required={true}
								/>
							)}
						/>
					</FormControl>
					<FormControl>
						<FormLabel>Other - want to add something more?</FormLabel>
						<Input {...register('notes', {})} />
					</FormControl>
					<hr />
					<HStack>
						<Grid templateColumns="repeat(4, 1fr)" gap={2} width={'full'}>
							<GridItem colSpan={2}>
								<HStack mb={3}>
									<Heading size={'md'}>Client</Heading>
									<Text>- You are creating the bid</Text>
								</HStack>
								<FormControl>
									<FormLabel>Client number</FormLabel>
									<Input
										required={true}
										{...register('clientUId', {
											required: 'client number is required'
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
