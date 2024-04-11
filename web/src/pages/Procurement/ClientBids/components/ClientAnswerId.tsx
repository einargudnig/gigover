import { useParams } from 'react-router-dom';
import React from 'react';
import {
	Box,
	Grid,
	GridItem,
	HStack,
	VStack,
	Text,
	Table,
	Thead,
	Tr,
	Th,
	Tooltip,
	Tbody,
	Td,
	Flex,
	Spacer,
	Button
} from '@chakra-ui/react';
import { useClientGetBidById } from '../../../../queries/procurement/client-bids/useGetClientBidById';
import { formatDateWithoutTime } from '../../../../utils/StringUtils';
import { ImportantIcon } from '../../../../components/icons/ImportantIcon';
import { Bid } from '../../../../models/Tender';

export const ClientAnswerId = (): JSX.Element => {
	const { bidId } = useParams<{ bidId: string }>();

	const { data, isLoading } = useClientGetBidById(Number(bidId)); // TODO add error handling
	const bid: Bid | undefined = data?.bid;
	console.log({ bid });
	// const bidItems = bid?.items;

	return (
		<>
			{/* Bid Header */}
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
										<Text fontSize={'lg'}>{bid?.description}</Text>
									</HStack>
									<HStack>
										<Text fontWeight={'bold'} fontSize={'xl'}>
											Terms:
										</Text>
										<Text fontSize={'lg'}>{bid?.terms}</Text>
									</HStack>
									<HStack>
										<Text fontWeight={'bold'} fontSize={'xl'}>
											Status:
										</Text>
										<Text fontSize={'lg'}>{bid?.status}</Text>
									</HStack>
								</VStack>

								<HStack mb={'4'}>
									<VStack mr={'3'}>
										<HStack>
											<Text fontWeight={'bold'} fontSize={'xl'}>
												Address:
											</Text>
											<Text fontSize={'lg'}>{bid?.address}</Text>
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
											<Text fontSize={'lg'}>
												{formatDateWithoutTime(new Date(bid!.finishDate))}
											</Text>
										</HStack>
										<HStack>
											<Text fontWeight={'bold'} fontSize={'xl'}>
												Notes:
											</Text>
											<Text fontSize={'lg'}>{bid?.notes}</Text>
										</HStack>
									</VStack>
								</HStack>
							</VStack>
						</Box>
					</GridItem>
					<GridItem colSpan={2}>
						<Box marginRight={'6'}>
							<VStack ml={'3'}>
								<HStack ml={'3'}>
									<Text fontWeight={'bold'} fontSize={'xl'}>
										Email:
									</Text>
									<Text fontSize={'lg'}>{bid?.bidderEmail}</Text>
								</HStack>
								<HStack ml={'3'}>
									<Text fontWeight={'bold'} fontSize={'xl'}>
										Name:
									</Text>
									<Text fontSize={'lg'}>{bid?.bidderName}</Text>
								</HStack>
							</VStack>
						</Box>
					</GridItem>
				</Grid>
			</Box>

			{/* Table */}
			<Table variant={'striped'}>
				<Thead>
					<Tr>
						<Th width={'20%'}>
							<Tooltip label="Cost code">
								<HStack>
									<Text>Number</Text>
									<ImportantIcon size={20} />
								</HStack>
							</Tooltip>
						</Th>

						<Th width={'20%'}>
							<Tooltip label="Description of a item">
								<HStack>
									<Text>Description</Text>
									<ImportantIcon size={20} />
								</HStack>
							</Tooltip>
						</Th>

						<Th width={'20%'}>
							<Tooltip label="Volume">
								<HStack>
									<Text color={'black'}>Volume</Text>
									<ImportantIcon size={20} />
								</HStack>
							</Tooltip>
						</Th>

						<Th width={'20%'}>
							<Tooltip label="Unit of measurement. For example: m2, kg, t">
								<HStack>
									<Text>Unit</Text>
									<ImportantIcon size={20} />
								</HStack>
							</Tooltip>
						</Th>
					</Tr>
				</Thead>
				<Tbody>
					<>
						{/* {tenderItems?.map((item) => (
							<Tr key={item.tenderItemId}>
								<Td width={'20%'}>{item.nr}</Td>
								<Td width={'20%'}>{item.description}</Td>
								<Td width={'20%'}>{item.volume}</Td>
								<Td width={'20%'}>{item.unit}</Td>
							</Tr>
						))} */}
						<Tr>
							<Td width={'20%'}>Number</Td>
							<Td width={'20%'}>Description</Td>
							<Td width={'20%'}>Volume</Td>
							<Td width={'20%'}>Cost</Td>
						</Tr>
						<Tr>
							<Td width={'20%'}>Number</Td>
							<Td width={'20%'}>Description</Td>
							<Td width={'20%'}>Volume</Td>
							<Td width={'20%'}>Cost</Td>
						</Tr>
						<Tr>
							<Td width={'20%'}>Number</Td>
							<Td width={'20%'}>Description</Td>
							<Td width={'20%'}>Volume</Td>
							<Td width={'20%'}>Cost</Td>
						</Tr>
					</>
				</Tbody>
			</Table>

			<Flex alignItems={'center'} justifyContent={'space-around'} marginTop={5}>
				<Box>
					<Button>Accept</Button>
				</Box>
				<Spacer />
				<Box>
					<Button>Reject</Button>
				</Box>
			</Flex>
		</>
	);
};
