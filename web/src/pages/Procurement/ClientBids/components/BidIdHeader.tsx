import {
	Box,
	Button,
	Checkbox,
	Flex,
	FormControl,
	FormErrorMessage,
	FormLabel,
	Grid,
	GridItem,
	HStack,
	Input,
	Text,
	VStack,
	useToast
} from '@chakra-ui/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { ConfirmDialog } from '../../../../components/ConfirmDialog';
import { TrashIcon } from '../../../../components/icons/TrashIcon';
import { Bid } from '../../../../models/Tender';
import { useDeleteBid } from '../../../../mutations/procurement/client-bids/useDeleteBid';
import { handleFinishDate } from '../../../../utils/HandleFinishDate';
import { formatDateWithoutTime } from '../../../../utils/StringUtils';

export const BidIdHeader = ({ bid }): JSX.Element => {
	const [isEditing, setIsEditing] = useState(false);

	return (
		<Box mb={1} p={4} borderRadius={8} borderColor={'#EFEFEE'} bg={'#EFEFEE'} w="100%">
			{isEditing ? (
				<EditBidForm bid={bid} setIsEditing={setIsEditing} />
			) : (
				<BidInfo bid={bid} />
			)}
			{!isEditing && <BidHeaderActions bid={bid} setIsEditing={setIsEditing} />}
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
	const [formData, setFormData] = useState({
		description: bid.description || '',
		terms: bid.terms || '',
		address: bid.address || '',
		delivery: bid.delivery || false,
		notes: bid.notes || '',
		clientEmail: bid.clientEmail || '',
		finishDate: bid.finishDate ? new Date(bid.finishDate) : new Date()
	});

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
			address: bid.address || ''
		},
		mode: 'onBlur'
	});

	const [isChecked, setIsChecked] = useState<number>(bid.delivery || 0);

	const handleChangeCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
		setIsChecked(e.target.checked ? 1 : 0);
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value, type } = e.target;
		if (type === 'checkbox') {
			setFormData({
				...formData,
				[name]: (e.target as HTMLInputElement).checked
			});
		} else {
			setFormData({
				...formData,
				[name]: value
			});
		}
	};

	const handleDateChange = (date: Date) => {
		setFormData({
			...formData,
			finishDate: date
		});
	};

	// Form submission
	const onSubmit = handleSubmit((formData) => {
		const tenderData = {
			tenderId: bid.bidId,
			description: formData.description,
			terms: formData.terms,
			finishDate: formData.finishDate,
			delivery: isChecked,
			address: formData.address,
			notes: formData.notes,
			status: bid.status || 0
		};

		// modifyTender(tenderData);
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
								required={true}
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
								required={true}
								{...register('terms', {
									required: 'Terms are required'
								})}
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
							<Input
								type="date"
								{...register('finishDate', {
									required: 'Close date is required'
								})}
								value={formData.finishDate.toISOString().split('T')[0]}
								onChange={(e) => handleDateChange(new Date(e.target.value))}
								borderColor={'gray.300'}
								borderRadius={'md'}
							/>
							<FormErrorMessage>{errors.finishDate?.message}</FormErrorMessage>
						</FormControl>
					</VStack>

					<VStack width={'45%'}>
						<FormControl id={'status'} isInvalid={!!errors.status}>
							<FormLabel>Status</FormLabel>
							<Text fontSize={'lg'}>
								{bid.status === 0 ? (
									<Text color={'gray'}>Unpublished</Text>
								) : bid.status === 1 ? (
									<Text>Published</Text>
								) : bid.status === 2 ? (
									<Text fontSize={'lg'} color={'red'}>
										Rejected
									</Text>
								) : bid.status === 3 ? (
									<Text fontSize={'lg'} color={'green'}>
										Accepted
									</Text>
								) : (
									'Unknown'
								)}
							</Text>
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
								value={formData.notes}
								onChange={handleChange}
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
								value={formData.clientEmail}
								onChange={handleChange}
								type="email"
								borderColor={'gray.300'}
								borderRadius={'md'}
								disabled
							/>
							<FormErrorMessage>{errors.clientEmail?.message}</FormErrorMessage>
						</FormControl>
					</VStack>

					<Flex position="absolute" bottom="0" right="4">
						<Button variant={'outline'} colorScheme={'black'} mr={3} type="submit">
							Save Changes
						</Button>
					</Flex>
				</Flex>
			</form>
		</Box>
	);
}

function BidInfo({ bid }: { bid: Bid }) {
	const handleDelivery = bid?.delivery ? 'Yes' : 'No';
	const time = bid?.finishDate;
	const date = new Date(time!);

	const status = () => {
		if (bid?.status === 0) {
			return <Text color={'gray'}>Unpublished</Text>;
		} else if (bid?.status === 1) {
			return <Text>Published</Text>;
		} else if (bid?.status === 2) {
			return (
				<Text fontSize={'lg'} color={'red'}>
					Rejected
				</Text>
			);
		} else if (bid?.status === 3) {
			return (
				<Text fontSize={'lg'} color={'green'}>
					Accepted
				</Text>
			);
		}
		return 'Unknown';
	};
	return (
		<Grid templateColumns="repeat(4, 1fr)" gap={4}>
			<GridItem colSpan={2}>
				<Box>
					<VStack>
						<VStack mb={'4'}>
							<HStack>
								<Text fontWeight={'bold'} fontSize={'xl'}>
									Description:
								</Text>
								<Text fontSize={'lg'}>{bid.description}</Text>
							</HStack>
							<HStack>
								<Text fontWeight={'bold'} fontSize={'xl'}>
									Terms:
								</Text>
								<Text fontSize={'lg'}>{bid.terms}</Text>
							</HStack>
							<HStack>
								<Text fontWeight={'bold'} fontSize={'xl'}>
									Status:
								</Text>
								<Text fontSize={'lg'}>{status()}</Text>
							</HStack>
						</VStack>

						<HStack mb={'4'}>
							<VStack mr={'3'}>
								<HStack>
									<Text fontWeight={'bold'} fontSize={'xl'}>
										Address:
									</Text>
									<Text fontSize={'lg'}>{bid.address}</Text>
								</HStack>
								<HStack>
									<Text fontWeight={'bold'} fontSize={'xl'}>
										Delivery:
									</Text>
									<Text fontSize={'lg'}>{handleDelivery}</Text>
								</HStack>
							</VStack>
							<VStack ml={'3'}>
								<HStack>
									<Text fontWeight={'bold'} fontSize={'xl'}>
										Close Date:
									</Text>
									<Text fontSize={'lg'}>{formatDateWithoutTime(date)}</Text>
								</HStack>
							</VStack>
						</HStack>
					</VStack>
				</Box>
			</GridItem>
			<GridItem colSpan={2}>
				<Box marginRight={'6'}>
					<VStack ml={'3'}>
						<HStack ml={'3'}>
							<Text fontWeight={'bold'} fontSize={'xl'}>
								Notes:
							</Text>
							<Text fontSize={'lg'}>{bid.notes}</Text>
						</HStack>
						<HStack ml={'3'}>
							<Text fontWeight={'bold'} fontSize={'xl'}>
								Client email:
							</Text>
							<Text fontSize={'lg'}>{bid.clientEmail}</Text>
						</HStack>
					</VStack>
				</Box>
			</GridItem>
		</Grid>
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
