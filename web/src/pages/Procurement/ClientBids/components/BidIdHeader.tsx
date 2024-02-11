import React from 'react';
import { Box, Grid, GridItem, HStack, VStack, Text } from '@chakra-ui/react';
// import { formatDateWithoutTime } from '../../../../utils/StringUtils';

export const BidIdHeader = ({ clientBid }): JSX.Element => {
	console.log('clientBid', clientBid);
	console.log(clientBid.bidItems);
	console.log(clientBid.bidder);
	const bidder = clientBid.bidder;
	console.log('Bidder', bidder);
	const client = clientBid?.client;

	const handleDelivery = clientBid?.delivery ? 'Yes' : 'No';
	// const time = clientBid?.finishDate;
	// const date = new Date(time!);

	return (
		<Box mb={1} p={4} borderRadius={8} borderColor={'#EFEFEE'} bg={'#EFEFEE'} w="100%">
			<Grid templateColumns="repeat(3, 1fr)" gap={4}>
				<GridItem colSpan={1}>
					<Box>
						<VStack>
							<VStack mb={'4'}>
								<HStack>
									<Text fontWeight={'bold'} fontSize={'xl'}>
										Description:
									</Text>
									<Text fontSize={'lg'}>{clientBid.description}</Text>
								</HStack>
								<HStack>
									<Text fontWeight={'bold'} fontSize={'xl'}>
										Terms:
									</Text>
									<Text fontSize={'lg'}>{clientBid.terms}</Text>
								</HStack>
								<HStack>
									<Text fontWeight={'bold'} fontSize={'xl'}>
										Status:
									</Text>
									<Text fontSize={'lg'}>{clientBid.status}</Text>
								</HStack>
							</VStack>

							<HStack mb={'4'}>
								<VStack mr={'3'}>
									<HStack>
										<Text fontWeight={'bold'} fontSize={'xl'}>
											Address:
										</Text>
										<Text fontSize={'lg'}>{clientBid.address}</Text>
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
										{/* <Text fontSize={'lg'}>{formatDateWithoutTime(date)}</Text> */}
										<Text fontSize={'lg'}>{clientBid.finishDate}</Text>
									</HStack>
									<HStack>
										<Text fontWeight={'bold'} fontSize={'xl'}>
											Phone:
										</Text>
										<Text fontSize={'lg'}>{clientBid.phoneNumber}</Text>
									</HStack>
								</VStack>
							</HStack>
						</VStack>
					</Box>
				</GridItem>
				<GridItem colSpan={1}>
					<Box marginRight={'6'}>
						<VStack ml={'3'}>
							<Text fontWeight={'bold'} fontSize={'xl'}>
								Bidder
							</Text>
							<HStack ml={'3'}>
								<Text fontWeight={'bold'} fontSize={'xl'}>
									Name:
								</Text>
								<Text fontSize={'lg'}>{clientBid.bidder.name}</Text>
							</HStack>
							<HStack ml={'3'}>
								<Text fontWeight={'bold'} fontSize={'xl'}>
									Email:
								</Text>
								<Text fontSize={'lg'}>{clientBid.bidder.email}</Text>
							</HStack>
							<HStack ml={'3'}>
								<Text fontWeight={'bold'} fontSize={'xl'}>
									Company:
								</Text>
								<Text fontSize={'lg'}>{bidder.company}</Text>
							</HStack>
							<HStack ml={'3'}>
								<Text fontWeight={'bold'} fontSize={'xl'}>
									Address:
								</Text>
								<Text fontSize={'lg'}>{bidder.address}</Text>
							</HStack>
							<HStack ml={'3'}>
								<Text fontWeight={'bold'} fontSize={'xl'}>
									Phone:
								</Text>
								<Text fontSize={'lg'}>{bidder.phoneNumber}</Text>
							</HStack>
						</VStack>
					</Box>
				</GridItem>
				<GridItem colSpan={1}>
					<Box marginRight={'6'}>
						<VStack ml={'3'}>
							<Text fontWeight={'bold'} fontSize={'xl'}>
								Client
							</Text>
							<HStack ml={'3'}>
								<Text fontWeight={'bold'} fontSize={'xl'}>
									Email:
								</Text>
								<Text fontSize={'lg'}>{client.email}</Text>
							</HStack>
							<HStack ml={'3'}>
								<Text fontWeight={'bold'} fontSize={'xl'}>
									Address:
								</Text>
								<Text fontSize={'lg'}>{client.address}</Text>
							</HStack>
							<HStack ml={'3'}>
								<Text fontWeight={'bold'} fontSize={'xl'}>
									Phone:
								</Text>
								<Text fontSize={'lg'}>{client.phoneNumber}</Text>
							</HStack>
							<HStack ml={'3'}>
								<Text fontWeight={'bold'} fontSize={'xl'}>
									Other:
								</Text>
								<Text fontSize={'lg'}>{client.other}</Text>
							</HStack>
						</VStack>
					</Box>
				</GridItem>
			</Grid>
		</Box>
	);
};
