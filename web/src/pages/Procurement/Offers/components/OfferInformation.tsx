import React from 'react';
import { Divider, Box, Flex, HStack, VStack, Text, Spacer } from '@chakra-ui/react';
// import { useParams } from 'react-router-dom';
import { formatDateWithoutTime } from '../../../../utils/StringUtils';

export const OfferInformation = ({ tender }): JSX.Element => {
	// const { offerId } = useParams();

	console.log('tender', tender);
	const date = new Date(tender.finishDate);
	const handleDelivery = tender.delivery ? 'Yes' : 'No';

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
								<VStack>Notes</VStack>
							</HStack>
							<Divider />
						</VStack>
					</Box>
				</Flex>
			</div>
		</>
	);
};
