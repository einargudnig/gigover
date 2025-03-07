import {
	Box,
	Button,
	Checkbox,
	Flex,
	FormControl,
	FormLabel,
	HStack,
	Input,
	Spacer,
	Text,
	Tooltip,
	VStack
} from '@chakra-ui/react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { DatePicker } from '../../../../components/forms/DatePicker';
import { CalendarIcon } from '../../../../components/icons/Calendar';
import { TenderFormData } from '../../../../mutations/procurement/useAddTender';
import { useModifyTender } from '../../../../mutations/procurement/useModifyTender';
import { formatDateWithoutTime } from '../../../../utils/StringUtils';

export function TenderHead({ tender }) {
	const [isEditing, setIsEditing] = useState(false);

	return (
		<Box marginTop={3} p={2} border={'1px'} borderColor={'gray.500'} rounded={'md'}>
			<Flex justifyContent={'space-around'}>
				{isEditing ? (
					<EditTenderForm tender={tender} setIsEditing={setIsEditing} />
				) : (
					<TenderInfo tender={tender} />
				)}
				<Box>
					<Button
						variant={'outline'}
						colorScheme={'black'}
						onClick={() => setIsEditing(!isEditing)}
						hidden={isEditing === true}
					>
						Edit tender
					</Button>
				</Box>
			</Flex>
		</Box>
	);
}

function TenderInfo({ tender }) {
	const time = tender?.finishDate;
	const date = new Date(time!);
	const handleDelivery = tender?.delivery ? 'Yes' : 'No';

	return (
		<Flex justifyContent={'space-around'}>
			<VStack mb={'4'}>
				<HStack>
					<Text fontWeight={'bold'} fontSize={'xl'}>
						Description:
					</Text>
					<Text fontSize={'lg'}>{tender?.description}</Text>
				</HStack>
				<HStack>
					<Text fontWeight={'bold'} fontSize={'xl'}>
						Terms:
					</Text>
					<Text fontSize={'lg'}>{tender?.terms}</Text>
				</HStack>
				<HStack>
					<Text fontWeight={'bold'} fontSize={'xl'}>
						Status:
					</Text>
					<Text fontSize={'lg'}>
						{tender?.status === 1 ? 'Published' : 'Not published'}
					</Text>
				</HStack>
			</VStack>

			<HStack mb={'4'}>
				<VStack mr={'3'}>
					<HStack>
						<Text fontWeight={'bold'} fontSize={'xl'}>
							Address:
						</Text>
						<Text fontSize={'lg'}>{tender?.address}</Text>
					</HStack>
					<HStack>
						<Text fontWeight={'bold'} fontSize={'xl'}>
							Delivery:
						</Text>
						<Text fontSize={'lg'}>{handleDelivery}</Text>
					</HStack>
				</VStack>
				<Spacer />
				<VStack ml={'3'}>
					<Tooltip
						hasArrow
						label="You will not be able to answer offer until this date has passed"
					>
						<HStack>
							<Text fontWeight={'bold'} fontSize={'xl'}>
								Close Date:
							</Text>
							<Text fontSize={'lg'}>{formatDateWithoutTime(date)}*</Text>
						</HStack>
					</Tooltip>
					<HStack>
						<Text fontWeight={'bold'} fontSize={'xl'}>
							Phone:
						</Text>
						<Text fontSize={'lg'}>{tender?.phoneNumber}</Text>
					</HStack>
				</VStack>
			</HStack>
		</Flex>
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
		<Flex justifyContent={'space-between'}>
			<form onSubmit={onSubmit}>
				<HStack>
					<VStack>
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

						<HStack>
							<Text fontWeight={'bold'} fontSize={'xl'}>
								Status:
							</Text>
							<Text fontSize={'lg'}>
								{tender?.status === 1 ? 'Published' : 'Not published'}
							</Text>
						</HStack>
					</VStack>

					<VStack>
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
				</HStack>

				<Flex justify="flex-end" mt={4}>
					<Button
						type="submit"
						colorScheme={'black'}
						variant={'outline'}
						isLoading={isLoading}
						loadingText="Updating..."
					>
						Update Tender
					</Button>
				</Flex>
			</form>
		</Flex>
	);
}
