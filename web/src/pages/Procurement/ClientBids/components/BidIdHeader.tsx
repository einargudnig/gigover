import React from 'react';
import { Box, Grid, GridItem, HStack, VStack, Text } from '@chakra-ui/react';
import { formatDateWithoutTime } from '../../../../utils/StringUtils';

export const BidIdHeader = ({ bid }): JSX.Element => {
	console.log('Header', { bid });

	const handleDelivery = bid?.delivery ? 'Yes' : 'No';
	const time = bid?.finishDate;
	const date = new Date(time!);

	return (
		<Box mb={1} p={4} borderRadius={8} borderColor={'#EFEFEE'} bg={'#EFEFEE'} w="100%">
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
									<Text fontSize={'lg'}>{bid.status}</Text>
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
							<Text fontWeight={'bold'} fontSize={'xl'}>
								Client
							</Text>
							<HStack ml={'3'}>
								<Text fontWeight={'bold'} fontSize={'xl'}>
									Email:
								</Text>
								{/* <Text fontSize={'lg'}>{client.email}</Text> */}
								<Text fontSize={'lg'}>email</Text>
							</HStack>
							<HStack ml={'3'}>
								<Text fontWeight={'bold'} fontSize={'xl'}>
									Address:
								</Text>
								{/* <Text fontSize={'lg'}>{client.address}</Text> */}
								<Text fontSize={'lg'}>address</Text>
							</HStack>
							<HStack ml={'3'}>
								<Text fontWeight={'bold'} fontSize={'xl'}>
									Phone:
								</Text>
								{/* <Text fontSize={'lg'}>{client.phoneNumber}</Text> */}
								<Text fontSize={'lg'}>phoneNumber</Text>
							</HStack>
							<HStack ml={'3'}>
								<Text fontWeight={'bold'} fontSize={'xl'}>
									Other:
								</Text>
								{/* <Text fontSize={'lg'}>{client.other}</Text> */}
								<Text fontSize={'lg'}>other</Text>
							</HStack>
						</VStack>
					</Box>
				</GridItem>
			</Grid>
		</Box>
	);
};
