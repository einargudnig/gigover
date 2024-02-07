import { Box, Flex, Grid, GridItem, HStack, VStack, Text, Spacer } from '@chakra-ui/react';
import React from 'react';
// import { handleFinishDate } from '../../../../utils/HandleFinishDate';
import { formatDateWithoutTime } from '../../../../utils/StringUtils';

export const BidId = (): JSX.Element => {
	// TODO fix this
	const handleDelivery = 'Yes';
	const date = new Date(1703199600000);
	// const finishDateStatus = handleFinishDate(date);

	return (
		<>
			{/* Client Bid header */}
			<div style={{ width: '100%' }}>
				<Flex direction={'column'}>
					<Box
						mb={1}
						p={4}
						borderRadius={8}
						borderColor={'#EFEFEE'}
						bg={'#EFEFEE'}
						w="100%"
					>
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
													<Text fontSize={'lg'}>{handleDelivery}</Text>
												</HStack>
											</VStack>
											<Spacer />
											<VStack ml={'3'}>
												<HStack>
													<Text fontWeight={'bold'} fontSize={'xl'}>
														Close Date:
													</Text>
													<Text fontSize={'lg'}>
														{formatDateWithoutTime(date)}
													</Text>
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
										<Text>Bidder</Text>
									</VStack>
								</Box>
							</GridItem>
							<GridItem colSpan={1}>
								<Box marginRight={'6'}>
									<VStack ml={'3'}>
										<Text>Client</Text>
									</VStack>
								</Box>
							</GridItem>
						</Grid>
					</Box>
				</Flex>
			</div>
			{/* Client Bid Table */}
		</>
	);
};
