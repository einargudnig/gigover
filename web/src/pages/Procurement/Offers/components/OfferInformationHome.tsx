import React from 'react';
import {
	Divider,
	Box,
	Button,
	FormControl,
	FormLabel,
	Input,
	Flex,
	HStack,
	VStack,
	Text,
	Spacer,
	useToast
} from '@chakra-ui/react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import { formatDateWithoutTime } from '../../../../utils/StringUtils';
import { useAddOffer } from '../../../../mutations/useAddOffer';

type OfferNote = {
	note: string;
};

export const OfferInformationHome = ({ tender }): JSX.Element => {
	const { tenderId } = useParams();
	const { mutateAsync: addOffer } = useAddOffer();
	const { handleSubmit, register } = useForm<OfferNote>({
		mode: 'onBlur'
	});
	const navigate = useNavigate();

	const date = new Date(tender.finishDate);
	const handleDelivery = tender.delivery ? 'Yes' : 'No';

	const toast = useToast();

	const onSubmit: SubmitHandler<OfferNote> = async (data: OfferNote) => {
		try {
			const body = {
				tenderId: Number(tenderId),
				note: data.note
			};

			// we can chain a .then() function to the end to receive the result of the mutation. In this case, we expect the result to be a number, which we can capture as the id parameter of the .then() function.
			const response = await addOffer(body).then((res) => res.data.id);

			// Before this was { id: 33 } because the AxiosResponse was of type AxiosResponse<{ id: number }>
			// Changed it to be of type AxiosResponse<number> and returned response.data.id in the mutation.
			const offerId = response;

			if (offerId !== 0) {
				navigate(`/tender/offers/${Number(tenderId)}/${offerId}`);
				console.log('Offer opened! With id: ', offerId);
				toast({
					title: 'Offer opened!',
					description:
						'You have opened an offer! Start to add numbers, cost and notes to the items.',
					status: 'success',
					duration: 5000,
					isClosable: true
				});
			} else {
				console.log('Cannot open offer with offerId: ', offerId);
				toast({
					title: 'Invalid tender!',
					description: `You cannot open an offer with offerId as ${offerId}. The tender is not valid.`,
					status: 'error',
					duration: 5000,
					isClosable: true
				});
			}
		} catch (e) {
			console.log(e);
		}
	};

	return (
		<>
			<div style={{ width: '100%' }}>
				<Flex direction={'column'}>
					<Box
						mb={2}
						p={4}
						borderRadius={8}
						borderColor={'#EFEFEE'}
						bg={'#EFEFEE'}
						w="100%"
					>
						<VStack pos={'relative'}>
							<VStack mb={'4'}>
								<HStack>
									<Text fontWeight={'bold'} fontSize={'xl'}>
										Description:
									</Text>
									<Text fontSize={'lg'}>{tender.description}</Text>
								</HStack>
								<HStack>
									<Text fontWeight={'bold'} fontSize={'xl'}>
										Terms:
									</Text>
									<Text fontSize={'lg'}>{tender.terms}</Text>
								</HStack>
							</VStack>

							<HStack mb={'4'}>
								<VStack mr={'3'}>
									<HStack>
										<Text fontWeight={'bold'} fontSize={'xl'}>
											Address:
										</Text>
										<Text fontSize={'lg'}>{tender.address}</Text>
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
									<HStack>
										<Text fontWeight={'bold'} fontSize={'xl'}>
											Close Date:
										</Text>
										<Text fontSize={'lg'}>{formatDateWithoutTime(date)}</Text>
									</HStack>
									<HStack>
										<Text fontWeight={'bold'} fontSize={'xl'}>
											Phone:
										</Text>
										<Text fontSize={'lg'}>{tender.phoneNumber}</Text>
									</HStack>
								</VStack>
							</HStack>
							<Divider />

							<form onSubmit={handleSubmit(onSubmit)}>
								<VStack spacing={4}>
									<Text>
										You can add notes to the offer. You need to open the offer
										so you can start making offers to items.
									</Text>
									<FormControl id={'email'}>
										<FormLabel>Note</FormLabel>
										<Input
											placeholder={
												"Do you want to add any notes? e.g. 'You can reach me at this hours..'"
											}
											{...register('note')}
											variant={'outline'}
											mb={'4'}
										/>
									</FormControl>
								</VStack>

								<Button type="submit">Open offer</Button>
							</form>
						</VStack>
					</Box>
				</Flex>
			</div>
		</>
	);
};
