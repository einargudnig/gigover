import React from 'react';
import { useParams } from 'react-router-dom';
import {
	Table,
	Thead,
	Td,
	Tr,
	Th,
	Tooltip,
	Divider,
	Box,
	Flex,
	HStack,
	VStack,
	Text,
	Tbody
} from '@chakra-ui/react';
import { useGetOfferByOfferId } from '../../../../queries/useGetOfferByOfferId';

export const PublishedTender = (): JSX.Element => {
	const { offerId } = useParams();
	const { data } = useGetOfferByOfferId(Number(offerId));
	const offer = data?.offer;
	const offerItems = data?.offer?.items;
	// console.log(offer);

	const formatNumber = (num: number) => {
		return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
	};

	const handleStatus = offer?.status ? 'Published' : 'Unpublished';
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
											Status:
										</Text>
										<Text fontSize={'lg'}>{handleStatus}</Text>
									</HStack>
									<HStack>
										<Text fontWeight={'bold'} fontSize={'xl'}>
											Notes:
										</Text>
										<Text fontSize={'lg'}>{offer?.notes}</Text>
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
						<Tooltip label="Product number">
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

						<Tooltip label="Cost for one item">
							<Th>Cost pr item</Th>
						</Tooltip>

						<Tooltip label="Total cost for items">
							<Th>Total Cost</Th>
						</Tooltip>

						<Tooltip label="Notes or certifications for the items.">
							<Th>Notes/Certifications</Th>
						</Tooltip>
					</Tr>
				</Thead>
				<Tbody>
					{offerItems?.map((item) => (
						<Tr key={item.tenderItemId}>
							<Td>{item.nr}</Td>
							<Td>{item.description}</Td>
							<Td>{item.volume}</Td>
							<Td>{item.unit}</Td>
							<Td>{formatNumber(item.cost)}</Td>
							<Td>{formatNumber(item.totalCost)}</Td>
							<Td>{item.note}</Td>
						</Tr>
					))}
				</Tbody>
			</Table>
		</>
	);
};
