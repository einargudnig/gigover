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
	Tooltip,
	VStack
} from '@chakra-ui/react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Center } from '../../../../components/Center';
import { LoadingSpinner } from '../../../../components/LoadingSpinner';
import { DatePicker } from '../../../../components/forms/DatePicker';
import { CalendarIcon } from '../../../../components/icons/Calendar';
import { TenderFormData } from '../../../../mutations/procurement/useAddTender';
import { useModifyTender } from '../../../../mutations/procurement/useModifyTender';
import { handleFinishDate } from '../../../../utils/HandleFinishDate';
import { formatDateWithoutTime } from '../../../../utils/StringUtils';

export function TenderHead({ tender, getTenderLoading }) {
	const [isEditing, setIsEditing] = useState(false);

	const disableButtons = handleFinishDate(tender?.finishDate);

	return (
		<Box
			marginTop={3}
			p={2}
			border={'1px'}
			borderColor={'gray.500'}
			rounded={'md'}
			position="relative"
			minHeight="200px"
		>
			{isEditing ? (
				<EditTenderForm tender={tender} setIsEditing={setIsEditing} />
			) : (
				<TenderInfo tender={tender} getTenderLoading={getTenderLoading} />
			)}
			<Flex position="absolute" bottom="4" right="4">
				{disableButtons ? (
					<Text>You cannot edit the tender until the close date has passed</Text>
				) : (
					<Button
						variant={'outline'}
						colorScheme={'black'}
						onClick={() => setIsEditing(!isEditing)}
						disabled={disableButtons}
						hidden={isEditing === true}
					>
						Edit tender
					</Button>
				)}
			</Flex>
		</Box>
	);
}

function TenderInfo({ tender, getTenderLoading }) {
	const time = tender?.finishDate;
	const date = new Date(time!);

	return (
		<>
			{getTenderLoading ? (
				<Center>
					<LoadingSpinner />
				</Center>
			) : (
				<Box width="100%" position="relative" pt="10px">
					<Flex justifyContent={'space-around'}>
						<VStack width={'45%'} align="stretch" spacing={4}>
							<Box>
								<Text fontWeight="bold" mb={1} color={'gray.700'}>
									Description
								</Text>
								<Box
									p={2}
									bg="gray.50"
									border="1px"
									borderColor="gray.200"
									borderRadius="md"
									minHeight="40px"
								>
									<Text>{tender?.description}</Text>
								</Box>
							</Box>

							<Box>
								<Text fontWeight="bold" mb={1} color={'gray.700'}>
									Terms
								</Text>
								<Box
									p={2}
									bg="gray.50"
									border="1px"
									borderColor="gray.200"
									borderRadius="md"
									minHeight="40px"
								>
									<Text>{tender?.terms}</Text>
								</Box>
							</Box>

							<Box>
								<Text fontWeight="bold" mb={1} color={'gray.700'}>
									Status
								</Text>
								<Box
									p={2}
									bg="gray.50"
									border="1px"
									borderColor="gray.200"
									borderRadius="md"
									minHeight="40px"
								>
									<Text>
										{tender?.status === 1 ? 'Published' : 'Not published'}
									</Text>
								</Box>
							</Box>

							<Box>
								<Text fontWeight="bold" mb={1} color={'gray.700'}>
									Address
								</Text>
								<Box
									p={2}
									bg="gray.50"
									border="1px"
									borderColor="gray.200"
									borderRadius="md"
									minHeight="40px"
								>
									<Text>{tender?.address}</Text>
								</Box>
							</Box>
						</VStack>

						<VStack width={'45%'} align="stretch" spacing={4}>
							<Box>
								<Text fontWeight="bold" mb={1} color={'gray.700'}>
									Delivery
								</Text>
								<Box p={2} minHeight="40px">
									<Checkbox isChecked={tender?.delivery === 1} />
								</Box>
							</Box>

							<Box>
								<Text fontWeight="bold" mb={1} color={'gray.700'}>
									Close Date
								</Text>
								<Tooltip
									hasArrow
									label="You will not be able to answer offer until this date has passed"
								>
									<Box
										p={2}
										bg="gray.50"
										border="1px"
										borderColor="gray.200"
										borderRadius="md"
										minHeight="40px"
									>
										<Text>{formatDateWithoutTime(date)}</Text>
									</Box>
								</Tooltip>
							</Box>

							<Box>
								<Text fontWeight="bold" mb={1} color={'gray.700'}>
									Phone Number
								</Text>
								<Box
									p={2}
									bg="gray.50"
									border="1px"
									borderColor="gray.200"
									borderRadius="md"
									minHeight="40px"
								>
									<Text>{tender?.phoneNumber}</Text>
								</Box>
							</Box>
						</VStack>
					</Flex>
				</Box>
			)}
		</>
	);
}

function EditTenderForm({ tender, setIsEditing }) {
	const currentDate = new Date();
	const [isChecked, setIsChecked] = useState<number>(tender.delivery || 0);

	const { mutate: modifyTender, isLoading } = useModifyTender();

	const handleChangeCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
		setIsChecked(e.target.checked ? 1 : 0);
	};

	// Form setup
	const {
		register,
		handleSubmit,
		formState: { errors },
		control
	} = useForm<TenderFormData>({
		defaultValues: {
			description: tender.description || '',
			terms: tender.terms || '',
			finishDate: tender.finishDate || 0,
			delivery: tender.delivery || 0,
			address: tender.address || '',
			phoneNumber: tender.phoneNumber || ''
		},
		mode: 'onBlur'
	});

	// Form submission
	const onSubmit = handleSubmit((formData) => {
		const tenderData = {
			tenderId: tender.tenderId,
			projectId: tender.projectId,
			projectName: tender.projectName,
			taskId: tender.taskId,
			description: formData.description,
			terms: formData.terms,
			finishDate: formData.finishDate,
			delivery: isChecked,
			address: formData.address,
			phoneNumber: formData.phoneNumber,
			status: tender.status || 0
		};

		modifyTender(tenderData);
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
							/>
							{errors.description && (
								<Text color="red.500">{errors.description.message}</Text>
							)}
						</FormControl>

						<FormControl id={'terms'} isInvalid={!!errors.terms}>
							<FormLabel>Terms</FormLabel>
							<Input
								required={true}
								{...register('terms', { required: 'Terms are required' })}
							/>
							{errors.terms && <Text color="red.500">{errors.terms.message}</Text>}
						</FormControl>

						<FormControl id={'status'}>
							<FormLabel>Status</FormLabel>
							<Input
								value={tender?.status === 1 ? 'Published' : 'Not published'}
								isReadOnly
								_disabled={{ opacity: 1, cursor: 'default' }}
								disabled
							/>
						</FormControl>

						<FormControl id={'address'} isInvalid={!!errors.address}>
							<FormLabel>Address - contact person on site</FormLabel>
							<Input
								required={true}
								{...register('address', {
									required: 'Address is required'
								})}
							/>
							{errors.address && (
								<Text color="red.500">{errors.address.message}</Text>
							)}
						</FormControl>
					</VStack>

					<VStack width={'45%'}>
						<FormControl id={'delivery'}>
							<FormLabel>Delivery</FormLabel>
							<Checkbox
								name="delivery"
								isChecked={isChecked === 1}
								onChange={handleChangeCheckbox}
							/>
						</FormControl>

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
							{errors.finishDate && (
								<Text color="red.500">{errors.finishDate.message}</Text>
							)}
						</FormControl>

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
					</VStack>
				</Flex>

				<Box position="absolute" bottom="0" right="4">
					<Button
						type="submit"
						colorScheme={'black'}
						variant={'outline'}
						isLoading={isLoading}
						loadingText="Updating..."
					>
						Update Tender
					</Button>
				</Box>
			</form>
		</Box>
	);
}
