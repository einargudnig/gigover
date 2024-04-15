import React from 'react';
import { useParams } from 'react-router-dom';
import {
	Box,
	Grid,
	GridItem,
	HStack,
	VStack,
	Table,
	Thead,
	Tr,
	Th,
	Tooltip,
	Tbody,
	Td,
	Flex,
	Text,
	Button,
	Spacer,
	useToast
} from '@chakra-ui/react';
import { useClientGetBidById } from '../../../../queries/procurement/client-bids/useGetClientBidById';
import { formatDateWithoutTime } from '../../../../utils/StringUtils';
import { ImportantIcon } from '../../../../components/icons/ImportantIcon';
import { Bid } from '../../../../models/Tender';
import { Center } from '../../../../components/Center';
import { LoadingSpinner } from '../../../../components/LoadingSpinner';
import { useAcceptBid } from '../../../../mutations/procurement/client-bids/useAcceptBid';
import { useRejectBid } from '../../../../mutations/procurement/client-bids/useRejectBid';

export const ClientAnswerId = (): JSX.Element => {
	const { bidId } = useParams<{ bidId: string }>();
	const { mutateAsync: acceptBid, isLoading: isAcceptBidLoading } = useAcceptBid();
	const { mutateAsync: rejectBid, isLoading: isRejectBidLoading } = useRejectBid();
	const { data, isLoading } = useClientGetBidById(Number(bidId)); // TODO add error handling

	const bid: Bid | undefined = data?.bid;
	const bidItems = bid?.items;

	const toast = useToast();

	const handleAcceptBid = () => {
		const bidBody = {
			bidId: Number(bidId)
		};

		try {
			console.log('Accept bid with this body', bidBody);
			acceptBid(bidBody);

			toast({
				title: 'Bid accepted',
				description: 'You have accepted this bid!',
				status: 'info',
				duration: 3000,
				isClosable: true
			});
		} catch (error) {
			console.log(error);
			toast({
				title: 'Error',
				description: 'There was an error in accepting the bid.',
				status: 'error',
				duration: 2000,
				isClosable: true
			});
		}
	};

	const handleRejectBid = () => {
		const bidBody = {
			bidId: Number(bidId)
		};
		console.log('Reject bid with this body:', bidBody);
		try {
			rejectBid(bidBody);
			toast({
				title: 'Bid rejected',
				description: 'You have rejected this bid!',
				status: 'info',
				duration: 3000,
				isClosable: true
			});
		} catch (error) {
			console.log(error);
			toast({
				title: 'Error',
				description: 'There was an error in rejecting the bid.',
				status: 'error',
				duration: 2000,
				isClosable: true
			});
		}
	};

	const formatNumber = (num: number) => {
		return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
	};

	const status = () => {
		if (bid?.status === 0) {
			return <Text color={'gray'}>Unpublished</Text>;
		} else if (bid?.status === 1) {
			return <Text>Published</Text>;
		} else if (bid?.status === 2) {
			return (
				<Text fontSize={'lg'} color={'red'}>
					Rejected
				</Text>
			);
		} else if (bid?.status === 3) {
			return (
				<Text fontSize={'lg'} color={'green'}>
					Accepted
				</Text>
			);
		}
		return 'Unknown';
	};

	return (
		<>
			{isLoading ? (
				<Center>
					<LoadingSpinner />
				</Center>
			) : (
				<>
					<Box
						mb={1}
						p={4}
						borderRadius={8}
						borderColor={'#EFEFEE'}
						bg={'#EFEFEE'}
						w="100%"
					>
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
												<Text fontSize={'lg'}>{status()}</Text>
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

													<Text fontSize={'lg'}>delivery</Text>
												</HStack>
											</VStack>
											<VStack ml={'3'}>
												<HStack>
													<Text fontWeight={'bold'} fontSize={'xl'}>
														Close Date:
													</Text>
													<Text fontSize={'lg'}>
														{formatDateWithoutTime(
															new Date(bid!.finishDate)
														)}
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

								<Th width={'20%'}>
									<Tooltip label="Cost of single item">
										<HStack>
											<Text>Cost</Text>
											<ImportantIcon size={20} />
										</HStack>
									</Tooltip>
								</Th>
							</Tr>
						</Thead>
						<Tbody>
							<>
								{bidItems?.map((item) => (
									<Tr key={item.bidItemId}>
										<Td width={'20%'}>{item.nr}</Td>
										<Td width={'20%'}>{item.description}</Td>
										<Td width={'20%'}>{item.volume}</Td>
										<Td width={'20%'}>{item.unit}</Td>
										<Td width={'20%'}>{formatNumber(item.cost!)}</Td>
									</Tr>
								))}
							</>
						</Tbody>
					</Table>
				</>
			)}

			{bid?.status === 2 || bid?.status === 3 ? (
				<Text marginTop={4} as="b">
					Bid Answered!
				</Text>
			) : (
				<>
					<Flex alignItems={'center'} justifyContent={'space-around'} marginTop={5}>
						<Box>
							<Button isLoading={isAcceptBidLoading} onClick={handleAcceptBid}>
								Accept
							</Button>
						</Box>
						<Spacer />
						<Box>
							<Button isLoading={isRejectBidLoading} onClick={handleRejectBid}>
								Reject
							</Button>
						</Box>
					</Flex>
				</>
			)}
		</>
	);
};
