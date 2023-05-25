import React from 'react';
import {
	Table,
	Td,
	Th,
	Thead,
	Tr,
	Tooltip,
	Divider,
	Box,
	Flex,
	HStack,
	VStack,
	Text,
	Tbody,
	Spacer
} from '@chakra-ui/react';
import { GetOfferItem } from '../../../../models/Tender';
import { LoadingSpinner } from '../../../../components/LoadingSpinner';

export const PublishedOffer = ({ offerData, isOfferLoading }): JSX.Element => {
	const offer = offerData?.offer;
	const offerItems: GetOfferItem[] | undefined = offerData?.offer.items;
	// console.log('offer', offer);

	const formatNumber = (num: number) => {
		return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
	};

	// function that adds the total cost of all items in the offer
	const totalCost = () => {
		let total = 0;
		offerItems?.forEach((item) => {
			// eslint-disable-next-line
			total += item.cost * item.volume;
		});
		return total;
	};

	return (
		<>
			{isOfferLoading ? (
				<div>
					<LoadingSpinner />
				</div>
			) : (
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
												Bidder Email:
											</Text>
											<Text fontSize={'lg'}>{offer?.email}</Text>
										</HStack>
										<HStack>
											<Text fontWeight={'bold'} fontSize={'xl'}>
												Bidder Name:
											</Text>
											<Text fontSize={'lg'}>{offer?.name}</Text>
										</HStack>
									</VStack>

									<HStack mb={'4'}>
										<VStack mr={'3'}>
											<HStack>
												<Text fontWeight={'bold'} fontSize={'xl'}>
													Notes:
												</Text>
												<Text fontSize={'lg'}>{offer?.note}</Text>
											</HStack>
										</VStack>
									</HStack>
									<Divider />
								</VStack>
							</Box>
						</Flex>
					</div>

					<Table>
						<Thead>
							<Tr>
								<Tooltip label="Item number">
									<Th>Number</Th>
								</Tooltip>

								<Tooltip label="Description of the items">
									<Th>Description</Th>
								</Tooltip>

								<Tooltip label="Volume, how many items">
									<Th>Volume</Th>
								</Tooltip>

								<Tooltip label="The measurement of unit for items">
									<Th>Unit</Th>
								</Tooltip>

								<Tooltip label="The cost of one items">
									<Th>Cost pr item</Th>
								</Tooltip>

								<Tooltip label="Total cost of the item. Volume, multiplied with cost per item">
									<Th>Total cost</Th>
								</Tooltip>

								<Tooltip label="Notes/certifications for the items.">
									<Th>Notes/Certifications</Th>
								</Tooltip>
							</Tr>
						</Thead>
						<Tbody>
							{offerItems?.map((row) => (
								<Tr key={row.tenderItemId}>
									<Td>{row.nr}</Td>
									<Td>{row.description}</Td>
									<Td>{row.volume}</Td>
									<Td>{row.unit}</Td>
									<Td>{formatNumber(row.cost)}</Td>
									<Td>{formatNumber(row.totalCost)}</Td>
									<Td>{row.note}</Td>
								</Tr>
							))}
							<Td></Td>
							<Td></Td>
							<Td></Td>
							<Td></Td>
							<Td>Total cost</Td>
							<Td>{formatNumber(totalCost())}</Td>
							<Td></Td>
						</Tbody>
					</Table>
					<Flex mx={'5'}>
						<Box>
							<Text mt={'4'} textColor={'gray-500'} fontSize={'large'}>
								This is the published offer!
							</Text>
						</Box>
						<Spacer />
						<Box>
							{/* <Text mt={'4'} textColor={'black'} fontSize={'large'}>
								The total cost for this tender is: {formatNumber(totalCost())}
							</Text> */}
						</Box>
					</Flex>
				</>
			)}
		</>
	);
};
