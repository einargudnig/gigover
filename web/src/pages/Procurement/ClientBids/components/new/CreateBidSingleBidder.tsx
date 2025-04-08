import {
	Box,
	Button,
	Checkbox,
	Flex,
	FormControl,
	FormLabel,
	HStack,
	Input,
	Text,
	useToast
} from '@chakra-ui/react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useQueryClient } from 'react-query';
import { DatePicker } from '../../../../../components/forms/DatePicker';
import { CalendarIcon } from '../../../../../components/icons/Calendar';
import { Bid } from '../../../../../models/Tender';
import { useAddBid } from '../../../../../mutations/procurement/client-bids/useAddBid';
import { ApiService } from '../../../../../services/ApiService';
import { devError } from '../../../../../utils/ConsoleUtils';

interface CreateBidSingleBidderProps {
	clientUId: string | null;
	onBidCreate: (bidId: number) => void;
}

export function CreateBidSingleBidder({ clientUId, onBidCreate }: CreateBidSingleBidderProps) {
	const [isChecked, setIsChecked] = useState<number>(0);

	const queryClient = useQueryClient();
	const toast = useToast();

	const { mutate, isLoading } = useAddBid({
		onSuccess: (bidId) => {
			// Here you get the tender ID as a number
			console.log('Created tender for a single client with ID:', bidId);
			onBidCreate(bidId);
			queryClient.refetchQueries(ApiService.getBids);
		},
		onError: (error) => {
			devError('Error creating tender for a single client:', error);
			toast({
				title: 'Error creating tender',
				description: 'Could not create tender. Please try again.',
				status: 'error',
				duration: 5000
			});
		}
	});

	const {
		register,
		control,
		handleSubmit,
		formState: { errors }
	} = useForm<Bid>({
		defaultValues: {
			description: '',
			terms: '',
			address: '',
			delivery: 0,
			finishDate: 0,
			notes: ''
		},
		mode: 'onBlur'
	});

	const handleChangeCheckbox = (event: React.ChangeEvent<HTMLInputElement>) => {
		const newValue = event.target.checked ? 1 : 0;
		setIsChecked(newValue);
	};

	// Form submission
	const onSubmit = handleSubmit((formData) => {
		console.log('Client UId:', clientUId);
		console.log('Form data:', formData);
		const tenderData = {
			clientUId,
			description: formData.description,
			terms: formData.terms,
			address: formData.address,
			delivery: isChecked,
			finishDate: formData.finishDate,
			notes: formData.notes
		};

		mutate(tenderData);
	});

	return (
		<Box>
			<form onSubmit={onSubmit}>
				<FormControl id={'description'} isInvalid={!!errors.description}>
					<FormLabel>Description</FormLabel>
					<Input
						required={true}
						{...register('description', {
							required: 'Bid description is required'
						})}
						placeholder={'Enter a description'}
						borderColor={'gray.300'}
					/>

					{errors.description && (
						<Text color="red.500">{errors.description.message}</Text>
					)}
				</FormControl>
				<Box mb={4} />
				<FormControl id={'terms'} isInvalid={!!errors.terms}>
					<FormLabel>Terms</FormLabel>
					<Input
						required={true}
						{...register('terms', {
							required: 'Terms are required'
						})}
						placeholder={'Enter terms'}
						borderColor={'gray.300'}
					/>

					{errors.terms && <Text color="red.500">{errors.terms.message}</Text>}
				</FormControl>
				<Box mb={4} />
				<FormControl id={'address'} isInvalid={!!errors.address}>
					<FormLabel>Address</FormLabel>
					<Input
						required={true}
						{...register('address', {
							required: 'Address is required'
						})}
						placeholder={'Enter an address'}
						borderColor={'gray.300'}
					/>

					{errors.address && <Text color="red.500">{errors.address.message}</Text>}
				</FormControl>
				<Box mb={4} />
				<FormControl id={'delivery'}>
					<FormLabel>Delivery</FormLabel>
					<Checkbox
						name="delivery"
						isChecked={isChecked === 1}
						onChange={handleChangeCheckbox}
						borderColor={'gray.300'}
					/>
				</FormControl>
				<Box mb={4} />
				<FormControl id={'finishDate'} isInvalid={!!errors.finishDate}>
					<FormLabel>Bid valid through</FormLabel>
					<Controller
						name="finishDate"
						control={control}
						render={({ field: { onChange, onBlur, value } }) => (
							<HStack>
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
									placeholderText="Select date" // Optional: adds placeholder text
								/>
								<CalendarIcon color={'black'} />
							</HStack>
						)}
					/>

					{errors.finishDate && <Text color="red.500">{errors.finishDate.message}</Text>}
				</FormControl>
				<Box mb={4} />
				<FormControl>
					<FormLabel>Other - want to add something more?</FormLabel>
					<Input
						{...register('notes', {})}
						placeholder={'Add a note'}
						borderColor={'gray.300'}
					/>
				</FormControl>
				<Flex justify={'end'} mt={4}>
					<Button
						type="submit"
						colorScheme={'black'}
						variant={'outline'}
						isLoading={isLoading}
						loadingText="Creating..."
					>
						Create Bid
					</Button>
				</Flex>
			</form>
		</Box>
	);
}
