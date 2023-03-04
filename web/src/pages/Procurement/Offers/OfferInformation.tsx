import React from 'react';
import { useParams } from 'react-router-dom';
import { Divider, Button, Box, Flex, HStack, VStack, Text, Spacer } from '@chakra-ui/react';
import { formatDateWithoutTime } from '../../../utils/StringUtils';
import { useAddOffers } from '../../../mutations/useAddOffers';
import { LoadingSpinner } from '../../../components/LoadingSpinner';

export const OfferInformation = ({
	description,
	terms,
	address,
	delivery,
	finishDate,
	phoneNumber
}): JSX.Element => {
	const { tenderId } = useParams();
	const date = new Date(finishDate);
	const { mutateAsync: addOffer, isLoading: isAddOfferLoading } = useAddOffers();
	const handleDelivery = delivery ? 'Yes' : 'No';

	//! I need to add the option to add a note to the offer
	// should I add a text input or a popup?
	const openOffer = () => {
		addOffer({
			tenderId: Number(tenderId),
			notes: 'This is a note'
		});
		console.log('Opened offer for tenderId: ', tenderId);
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
							{/* First stack of desc and terms */}
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
							{/* Second stack of address, delivery, finish date and phone */}
							<HStack mb={'4'}>
								{/* Address and delivery */}
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
							{/* //! This should come from */}
							<HStack>
								<Text fontWeight={'bold'} fontSize={'xl'}>
									Notes regarding the offer:
								</Text>
								{/* <Text fontSize={'lg'}>{notes}</Text> */}
								<Text fontSize={'lg'}>
									Notes for the offer, this is a good note!
								</Text>
							</HStack>
							{/* This button allow the user to open an offer for this Tender.
								// It's needed so he can add offer to the items in the offer table.
								// I should make the table disabled? if there is no openOffer?
								// Means, if there is no offerId, the table should be disabled.
								// ! useAddOffer
							*/}
							<HStack pos={'absolute'} bottom={'0'} right={'0'}>
								<Button onClick={openOffer}>
									{isAddOfferLoading ? <LoadingSpinner /> : 'Open Offer'}
								</Button>
							</HStack>
						</VStack>
					</Box>
				</Flex>
			</div>
		</>
	);
};
