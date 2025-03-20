import {
	Box,
	Button,
	Checkbox,
	Flex,
	FormControl,
	FormLabel,
	HStack,
	Input,
	useToast
} from '@chakra-ui/react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { DatePicker } from '../../../../../components/forms/DatePicker';
import { Bid } from '../../../../../models/Tender';
import { CalendarIcon } from '../../../../../components/icons/Calendar';
import { useAddBid } from '../../../../../mutations/procurement/client-bids/useAddBid';
import { ApiService } from '../../../../../services/ApiService';
import { devError } from '../../../../../utils/ConsoleUtils';
import { useQueryClient } from 'react-query';

interface CreateBidSingleBidderProps {
	onBidCreate: (bidId: number) => void;
}

export function CreateBidSingleBidder({ onBidCreate }: CreateBidSingleBidderProps) {
	const [isChecked, setIsChecked] = useState<number>(0);

	const queryClient = useQueryClient();
	const toast = useToast();

	const { mutate, isLoading } = useAddBid({
		onSuccess: (tenderId) => {
			// Here you get the tender ID as a number
			console.log('Created tender with ID:', tenderId);
			onBidCreate(tenderId);
			queryClient.refetchQueries(ApiService.userTenders);
		},
		onError: (error) => {
			devError('Error creating tender:', error);
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
			bidId: 0,
			description: '',
			terms: '',
			address: '',
			delivery: 0,
			finishDate: 0,
			status: 0,
			clientUId: '',
			clientEmail: '',
			bidderUId: '',
			bidderName: '',
			bidderEmail: '',
			notes: '',
			items: []
		},
		mode: 'onBlur'
	});

	const handleChangeCheckbox = (event: React.ChangeEvent<HTMLInputElement>) => {
		const newValue = event.target.checked ? 1 : 0;
		setIsChecked(newValue);
	};

	// Form submission
	const onSubmit = handleSubmit((formData) => {
		const tenderData = {};

		mutate(tenderData);
	});

	return (
		<Box>
			<form onSubmit={onSubmit}>
				<FormControl id={'description'}>
					<FormLabel>Description</FormLabel>
					<Input
						required={true}
						{...register('description', {
							required: 'Bid description is required'
						})}
						placeholder={'Enter a description'}
						borderColor={'gray.300'}
					/>
				</FormControl>
				<Box mb={4} />
				<FormControl id={'terms'}>
					<FormLabel>Terms</FormLabel>
					<Input
						required={true}
						{...register('terms', {
							required: 'Terms are required'
						})}
						placeholder={'Enter terms'}
						borderColor={'gray.300'}
					/>
				</FormControl>
				<FormControl id={'address'}>
					<FormLabel>Address</FormLabel>
					<Input
						required={true}
						{...register('address', {
							required: 'Address is required'
						})}
						placeholder={'Enter an address'}
						borderColor={'gray.300'}
					/>
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
				<FormControl id={'finishDate'}>
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
						Create Tender
					</Button>
				</Flex>
			</form>
		</Box>
	);
}
