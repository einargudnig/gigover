import { Box, Grid, GridItem, HStack, VStack, Text } from '@chakra-ui/react';
import React from 'react';
// import { handleFinishDate } from '../../../../utils/HandleFinishDate';
// import { formatDateWithoutTime } from '../../../../utils/StringUtils';

export const BidIdHeader = (): JSX.Element => {
	// TODO fix this
	// const handleDelivery = 'Yes';
	// const date = new Date(1703199600000);
	// const finishDateStatus = handleFinishDate(date);

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
									<Text fontSize={'lg'}>description</Text>
								</HStack>
								<HStack>
									<Text fontWeight={'bold'} fontSize={'xl'}>
										Terms:
									</Text>
									<Text fontSize={'lg'}>terms</Text>
								</HStack>
								<HStack>
									<Text fontWeight={'bold'} fontSize={'xl'}>
										Status:
									</Text>
									<Text fontSize={'lg'}>Not published</Text>
								</HStack>
							</VStack>

							<HStack mb={'4'}>
								<VStack mr={'3'}>
									<HStack>
										<Text fontWeight={'bold'} fontSize={'xl'}>
											Address:
										</Text>
										<Text fontSize={'lg'}>address</Text>
									</HStack>
									<HStack>
										<Text fontWeight={'bold'} fontSize={'xl'}>
											Delivery:
										</Text>
										{/* <Text fontSize={'lg'}>{handleDelivery}</Text> */}
										<Text fontSize={'lg'}>delivery</Text>
									</HStack>
								</VStack>
								<VStack ml={'3'}>
									<HStack>
										<Text fontWeight={'bold'} fontSize={'xl'}>
											Close Date:
										</Text>
										{/* <Text fontSize={'lg'}>{formatDateWithoutTime(date)}</Text> */}
										<Text fontSize={'lg'}>date</Text>
									</HStack>
									<HStack>
										<Text fontWeight={'bold'} fontSize={'xl'}>
											Phone:
										</Text>
										<Text fontSize={'lg'}>1234567</Text>
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
								<Text fontSize={'lg'}>name</Text>
							</HStack>
							<HStack ml={'3'}>
								<Text fontWeight={'bold'} fontSize={'xl'}>
									Email:
								</Text>
								<Text fontSize={'lg'}>email</Text>
							</HStack>
							<HStack ml={'3'}>
								<Text fontWeight={'bold'} fontSize={'xl'}>
									Company:
								</Text>
								<Text fontSize={'lg'}>company</Text>
							</HStack>
							<HStack ml={'3'}>
								<Text fontWeight={'bold'} fontSize={'xl'}>
									Address:
								</Text>
								<Text fontSize={'lg'}>address</Text>
							</HStack>
							<HStack ml={'3'}>
								<Text fontWeight={'bold'} fontSize={'xl'}>
									Phone:
								</Text>
								<Text fontSize={'lg'}>phoneNumber</Text>
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
									Name:
								</Text>
								<Text fontSize={'lg'}>name</Text>
							</HStack>
							<HStack ml={'3'}>
								<Text fontWeight={'bold'} fontSize={'xl'}>
									Email:
								</Text>
								<Text fontSize={'lg'}>email</Text>
							</HStack>
							<HStack ml={'3'}>
								<Text fontWeight={'bold'} fontSize={'xl'}>
									Address:
								</Text>
								<Text fontSize={'lg'}>address</Text>
							</HStack>
							<HStack ml={'3'}>
								<Text fontWeight={'bold'} fontSize={'xl'}>
									Phone:
								</Text>
								<Text fontSize={'lg'}>phoneNumber</Text>
							</HStack>
							<HStack ml={'3'}>
								<Text fontWeight={'bold'} fontSize={'xl'}>
									Other:
								</Text>
								<Text fontSize={'lg'}>other</Text>
							</HStack>
						</VStack>
					</Box>
				</GridItem>
			</Grid>
		</Box>
	);
};
