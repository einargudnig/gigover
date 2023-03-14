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
	Spacer
} from '@chakra-ui/react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { formatDateWithoutTime } from '../../../../utils/StringUtils';
import { useAddOffer } from '../../../../mutations/useAddOffer';

type OfferNote = {
	note: string;
};

export const OfferInformation = ({
	description,
	terms,
	address,
	delivery,
	finishDate,
	phoneNumber
}): JSX.Element => {
	const { tenderId } = useParams();
	const { handleSubmit, register } = useForm<OfferNote>();
	const date = new Date(finishDate);
	const handleDelivery = delivery ? 'Yes' : 'No';
	const { mutateAsync: addOffer } = useAddOffer();

	const onSubmit: SubmitHandler<OfferNote> = async (data: OfferNote) => {
		try {
			const body = {
				tenderId: Number(tenderId),
				note: data.note
			};

			const response = await addOffer(body);
			console.log(response);
			// const offerId = response.id; //! This does ALWAYS return undefined
			// console.log(offerId);
			console.log('Offer opened!');
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
									<Text fontSize={'lg'}>{description}</Text>
								</HStack>
								<HStack>
									<Text fontWeight={'bold'} fontSize={'xl'}>
										Terms:
									</Text>
									<Text fontSize={'lg'}>{terms}</Text>
								</HStack>
							</VStack>

							<HStack mb={'4'}>
								<VStack mr={'3'}>
									<HStack>
										<Text fontWeight={'bold'} fontSize={'xl'}>
											Address:
										</Text>
										<Text fontSize={'lg'}>{address}</Text>
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
										<Text fontSize={'lg'}>{phoneNumber}</Text>
									</HStack>
								</VStack>
							</HStack>
							<Divider />
							{/* //! This should come from the openOffer!
									// Let's start by hiding this in the UI.
							*/}
							{/* <HStack>
								<Text fontWeight={'bold'} fontSize={'xl'}>
									Notes regarding the offer:
								</Text>
								{noNote ? <Text fontSize={'lg'}>{offerNote}</Text> : 'No notes'}
							</HStack> */}
							{/* This button allow the user to open an offer for this Tender.
								// It's needed so he can add offer to the items in the offer table.
							*/}

							<form onSubmit={handleSubmit(onSubmit)}>
								<VStack spacing={4}>
									<Text>
										You can add notes to the offer. You need to open the offer
										so you can start making offers to items.
									</Text>
									<FormControl id={'email'}>
										<FormLabel>Note</FormLabel>
										<Input
											name="notes"
											placeholder={
												"Do you want to add any notes? e.g. 'You can reach me at this hours..'"
											}
											// ref={register('notes')} //! Make sure this works!
											variant={'outline'}
											mb={'4'}
										/>
									</FormControl>
								</VStack>

								<Button type="submit">Open offer</Button>
							</form>

							{/* <HStack pos={'absolute'} bottom={'0'} right={'0'}>
								<OpenOffer />
							</HStack> */}
						</VStack>
					</Box>
				</Flex>
			</div>
		</>
	);
};
