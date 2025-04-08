import {
	Box,
	Button,
	Checkbox,
	Flex,
	FormControl,
	FormErrorMessage,
	FormLabel,
	HStack,
	Input,
	Text,
	VStack,
	useToast
} from '@chakra-ui/react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import { ConfirmDialog } from '../../../../components/ConfirmDialog';
import { DatePicker } from '../../../../components/forms/DatePicker';
import { CalendarIcon } from '../../../../components/icons/Calendar';
import { TrashIcon } from '../../../../components/icons/TrashIcon';
import { Bid } from '../../../../models/Tender';
import { useDeleteBid } from '../../../../mutations/procurement/client-bids/useDeleteBid';
import { useEditBid } from '../../../../mutations/procurement/client-bids/useEditBid';
import { handleFinishDate } from '../../../../utils/HandleFinishDate';
import { formatDateWithoutTime } from '../../../../utils/StringUtils';

export const BidIdHeader = ({ bid }): JSX.Element => {
	const [isEditing, setIsEditing] = useState(false);
	const location = useLocation();
	const isBidPage = location.pathname === '/tender/bids';

	return (
		<Box
			marginTop={3}
			p={4}
			border={'1px'}
			borderColor={'gray.500'}
			rounded={'md'}
			position="relative"
			minHeight="220px"
		>
			{isEditing ? (
				<EditBidForm bid={bid} setIsEditing={setIsEditing} />
			) : (
				<BidInfo bid={bid} />
			)}
			{!isEditing && !isBidPage && <BidHeaderActions bid={bid} setIsEditing={setIsEditing} />}
		</Box>
	);
};

function EditBidForm({
	bid,
	setIsEditing
}: {
	bid: Bid;
	setIsEditing: (isEditing: boolean) => void;
}) {
	const { mutateAsync: editBidAsync, isLoading } = useEditBid();

	// Form setup
	const {
		register,
		handleSubmit,
		formState: { errors },
		control
	} = useForm<Bid>({
		defaultValues: {
			description: bid.description || '',
			terms: bid.terms || '',
			finishDate: bid.finishDate || 0,
			delivery: bid.delivery || 0,
			address: bid.address || '',
			notes: bid.notes || '',
			clientEmail: bid.clientEmail
		},
		mode: 'onBlur'
	});

	const [isChecked, setIsChecked] = useState<number>(bid.delivery || 0);

	const handleChangeCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
		setIsChecked(e.target.checked ? 1 : 0);
	};

	const currentDate = new Date();

	// Form submission
	const onSubmit = handleSubmit(async (formData) => {
		const tenderData = {
			bidId: bid.bidId,
			description: formData.description,
			terms: formData.terms,
			finishDate: formData.finishDate,
			delivery: isChecked,
			address: formData.address,
			notes: formData.notes,
			status: bid.status || 0,
			clientUId: bid.clientUId,
			clientEmail: formData.clientEmail
		};

		await editBidAsync(tenderData);
		setIsEditing(false);
	});

	return (
		<Box width="100%" position="relative">
			<form onSubmit={onSubmit}>
				<Flex justifyContent={'space-around'} paddingTop={'10px'}>
					<VStack width={'45%'}>
						<FormControl id={'description'} isInvalid={!!errors.description}>
							<FormLabel>Description</FormLabel>
							<Input
								{...register('description', {
									required: 'Procurement description is required'
								})}
								borderColor={'gray.300'}
								borderRadius={'md'}
							/>
							<FormErrorMessage>{errors.description?.message}</FormErrorMessage>
						</FormControl>
						<FormControl id={'terms'} isInvalid={!!errors.terms}>
							<FormLabel>Terms</FormLabel>
							<Input
								{...register('terms')}
								borderColor={'gray.300'}
								borderRadius={'md'}
							/>
							<FormErrorMessage>{errors.terms?.message}</FormErrorMessage>
						</FormControl>

						<FormControl id={'address'} isInvalid={!!errors.address}>
							<FormLabel>Address</FormLabel>
							<Input
								{...register('address', {
									required: 'Address is required'
								})}
								borderColor={'gray.300'}
								borderRadius={'md'}
							/>
							<FormErrorMessage>{errors.address?.message}</FormErrorMessage>
						</FormControl>

						<FormControl id={'finishDate'} isInvalid={!!errors.finishDate}>
							<FormLabel>Close Date</FormLabel>
							<Controller
								name="finishDate"
								control={control}
								rules={{ required: 'Finish date is required' }}
								render={({ field }) => (
									<HStack>
										<DatePicker
											selected={field.value ? new Date(field.value) : null}
											onChange={(date: Date | null) => {
												if (date) {
													// Ensure we're setting the full timestamp
													field.onChange(date.getTime());
												} else {
													field.onChange(null);
												}
											}}
											onBlur={field.onBlur}
											minDate={currentDate}
											dateFormat="dd/MM/yyyy"
											required={true}
										/>
										<CalendarIcon color={'black'} />
									</HStack>
								)}
							/>
							<FormErrorMessage>{errors.finishDate?.message}</FormErrorMessage>
						</FormControl>
					</VStack>

					<VStack width={'45%'}>
						<FormControl id={'status'} isInvalid={!!errors.status}>
							<FormLabel>Status</FormLabel>
							<Input
								value={bid?.status === 1 ? 'Published' : 'Not published'}
								isReadOnly
								_disabled={{ opacity: 1, cursor: 'default' }}
								disabled
							/>
						</FormControl>
						<FormControl id={'delivery'} isInvalid={!!errors.delivery}>
							<FormLabel>Delivery</FormLabel>
							<Checkbox
								{...register('delivery', {
									required: 'Delivery is required'
								})}
								isChecked={isChecked === 1}
								onChange={handleChangeCheckbox}
							/>
							<FormErrorMessage>{errors.delivery?.message}</FormErrorMessage>
						</FormControl>
						<FormControl id={'notes'} isInvalid={!!errors.notes}>
							<FormLabel>Notes</FormLabel>
							<Input
								{...register('notes')}
								borderColor={'gray.300'}
								borderRadius={'md'}
							/>
							<FormErrorMessage>{errors.notes?.message}</FormErrorMessage>
						</FormControl>
						<FormControl id={'clientEmail'} isInvalid={!!errors.clientEmail}>
							<FormLabel>Client email</FormLabel>
							<Input
								{...register('clientEmail', {
									required: 'Client email is required'
								})}
								disabled
								width={'65%'}
								borderColor={'gray.300'}
								borderRadius={'md'}
							/>
							<FormErrorMessage>{errors.clientEmail?.message}</FormErrorMessage>
						</FormControl>
					</VStack>

					<Box position="absolute" bottom="0" right="4">
						<Button
							variant={'outline'}
							colorScheme={'black'}
							type="submit"
							isLoading={isLoading}
						>
							Save Changes
						</Button>
					</Box>
				</Flex>
			</form>
		</Box>
	);
}

function BidInfo({ bid }: { bid: Bid }) {
	const time = bid?.finishDate;
	const date = new Date(time!);

	return (
		<Box width="100%" position="relative">
			<Flex justifyContent={'space-around'} paddingTop={'10px'}>
				<VStack width={'45%'}>
					<FormControl>
						<FormLabel>Description</FormLabel>
						<Input
							value={bid.description}
							isReadOnly
							_disabled={{ opacity: 1, cursor: 'default' }}
							disabled
							borderColor={'gray.300'}
							borderRadius={'md'}
						/>
					</FormControl>
					<FormControl>
						<FormLabel>Terms</FormLabel>
						<Input
							value={bid.terms}
							isReadOnly
							_disabled={{ opacity: 1, cursor: 'default' }}
							disabled
							borderColor={'gray.300'}
							borderRadius={'md'}
						/>
					</FormControl>
					<FormControl>
						<FormLabel>Address</FormLabel>
						<Input
							value={bid.address}
							isReadOnly
							_disabled={{ opacity: 1, cursor: 'default' }}
							disabled
							borderColor={'gray.300'}
							borderRadius={'md'}
						/>
					</FormControl>
					<FormControl>
						<FormLabel>Close Date</FormLabel>
						<HStack>
							<Input
								value={formatDateWithoutTime(date)}
								isReadOnly
								_disabled={{ opacity: 1, cursor: 'default' }}
								disabled
								borderColor={'gray.300'}
								borderRadius={'md'}
							/>
							<CalendarIcon color={'black'} />
						</HStack>
					</FormControl>
				</VStack>

				<VStack width={'45%'}>
					<FormControl>
						<FormLabel>Status</FormLabel>
						<Input
							value={'Not published'}
							isReadOnly
							_disabled={{ opacity: 1, cursor: 'default' }}
							disabled
							borderColor={'gray.300'}
							borderRadius={'md'}
						/>
					</FormControl>
					<FormControl>
						<FormLabel>Delivery</FormLabel>
						<Checkbox isChecked={bid.delivery === 1} isDisabled={true} />
					</FormControl>
					<FormControl>
						<FormLabel>Notes</FormLabel>
						<Input
							value={bid.notes}
							isReadOnly
							_disabled={{ opacity: 1, cursor: 'default' }}
							disabled
							borderColor={'gray.300'}
							borderRadius={'md'}
						/>
					</FormControl>
					<FormControl>
						<FormLabel>Client email</FormLabel>
						<Input
							value={bid.clientEmail}
							isReadOnly
							_disabled={{ opacity: 1, cursor: 'default' }}
							disabled
							width={'65%'}
							borderColor={'gray.300'}
							borderRadius={'md'}
						/>
					</FormControl>
				</VStack>
			</Flex>
		</Box>
	);
}

export function BidHeaderActions({
	bid,
	setIsEditing
}: {
	bid: Bid;
	setIsEditing: (isEditing: boolean) => void;
}) {
	const [dialogOpen, setDialogOpen] = useState(false);
	const { mutateAsync: deleteBidAsync, isLoading: isLoadingDelete } = useDeleteBid();
	const finishDateStatus = handleFinishDate(bid?.finishDate);

	const toast = useToast();
	const navigate = useNavigate();

	return (
		<Flex justifyContent={'flex-end'} marginTop={'1'} marginBottom={'2'}>
			{!finishDateStatus ? (
				<HStack>
					<Button
						variant={'outline'}
						colorScheme={'black'}
						onClick={() => setIsEditing(true)}
					>
						Edit Bid
					</Button>
					{bid === undefined ? null : (
						<ConfirmDialog
							header={'Delete bid'}
							setIsOpen={setDialogOpen}
							callback={async () => {
								if (bid?.status === 1) {
									toast({
										title: 'Cannot delete published bid',
										description:
											'This bid has been published and cannot be deleted',
										status: 'error',
										duration: 2000,
										isClosable: true
									});
								} else {
									await deleteBidAsync(bid);
									navigate('/tender/bids');
								}
								setDialogOpen(false);
							}}
							isOpen={dialogOpen}
						>
							<Button
								aria-label={'Delete'}
								colorScheme={'red'}
								variant={'outline'}
								isLoading={isLoadingDelete}
								leftIcon={<TrashIcon color={'red'} size={20} />}
								onClick={() => {
									setDialogOpen(true);
								}}
							>
								Delete bid
							</Button>
						</ConfirmDialog>
					)}
				</HStack>
			) : (
				<Text as="b" color={'black'}>
					You cannot edit or delete when the finish date has passed!
				</Text>
			)}
		</Flex>
	);
}
