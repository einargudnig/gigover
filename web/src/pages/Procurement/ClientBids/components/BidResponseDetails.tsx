import { ArrowBackIcon } from '@chakra-ui/icons';
import {
	Box,
	Button,
	Flex,
	HStack,
	Spacer,
	Table,
	Tbody,
	Td,
	Text,
	Th,
	Thead,
	Tooltip,
	Tr,
	VStack,
	useToast
} from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';
import { Center } from '../../../../components/Center';
import { LoadingSpinner } from '../../../../components/LoadingSpinner';
import { ImportantIcon } from '../../../../components/icons/ImportantIcon';
import { Bid } from '../../../../models/Tender';
import { useAcceptBid } from '../../../../mutations/procurement/client-bids/useAcceptBid';
import { useRejectBid } from '../../../../mutations/procurement/client-bids/useRejectBid';
import { useClientGetBidById } from '../../../../queries/procurement/client-bids/useGetClientBidById';
import { formatDateWithoutTime } from '../../../../utils/StringUtils';
import { AnswerBid } from './AnswerBid';

interface HandledTextProps {
	status?: number;
}

export const BidResponseDetails = (): JSX.Element => {
	const { bidId } = useParams<{ bidId: string }>();
	const { mutateAsync: acceptBid, isLoading: isAcceptBidLoading } = useAcceptBid();
	const { mutateAsync: rejectBid, isLoading: isRejectBidLoading } = useRejectBid();
	const { data, isLoading } = useClientGetBidById(Number(bidId)); // TODO add error handling
	const navigate = useNavigate();

	const bid: Bid | undefined = data?.bid;
	const bidItems = bid?.items;

	const toast = useToast();

	const hasBidAnswer = bid?.status === 2 || bid?.status === 3;

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
		if (bid?.status === 0 || bid?.status === 1) {
			return <Text color={'gray'}>Unanswered</Text>;
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
		<Box p={4}>
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
						<Button
							onClick={() => navigate(-1)}
							variant={'link'}
							colorScheme={'gray'}
							fontSize={'lg'}
						>
							<ArrowBackIcon />
						</Button>
						<Flex justify={'space-between'}>
							<Box w={'45%'}>
								<VStack>
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
										<Text fontSize={'lg'}>{bid?.delivery ? 'Yes' : 'No'}</Text>
									</HStack>
								</VStack>
							</Box>

							<Box w={'45%'}>
								<VStack>
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
											Email:
										</Text>
										<Text fontSize={'lg'}>{bid?.bidderEmail}</Text>
									</HStack>
									<HStack>
										<Text fontWeight={'bold'} fontSize={'xl'}>
											Name:
										</Text>
										<Text fontSize={'lg'}>{bid?.bidderName}</Text>
									</HStack>

									<HStack>
										<Text fontWeight={'bold'} fontSize={'xl'}>
											Notes:
										</Text>
										<Text fontSize={'lg'}>{bid?.notes}</Text>
									</HStack>
								</VStack>
							</Box>
						</Flex>
					</Box>

					<Table variant={'striped'}>
						<Thead>
							<Tr>
								<Th width={'20%'}>
									<Tooltip hasArrow label="Cost code">
										<HStack>
											<Text>Number</Text>
											<ImportantIcon size={20} />
										</HStack>
									</Tooltip>
								</Th>

								<Th width={'20%'}>
									<Tooltip hasArrow label="Description of a item">
										<HStack>
											<Text>Description</Text>
											<ImportantIcon size={20} />
										</HStack>
									</Tooltip>
								</Th>

								<Th width={'20%'}>
									<Tooltip hasArrow label="Volume">
										<HStack>
											<Text color={'black'}>Volume</Text>
											<ImportantIcon size={20} />
										</HStack>
									</Tooltip>
								</Th>

								<Th width={'20%'}>
									<Tooltip
										hasArrow
										label="Unit of measurement. For example: m2, kg, t"
									>
										<HStack>
											<Text>Unit</Text>
											<ImportantIcon size={20} />
										</HStack>
									</Tooltip>
								</Th>

								<Th width={'20%'}>
									<Tooltip hasArrow label="Cost of single item">
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

			{hasBidAnswer ? (
				<Flex justify={'end'}>
					<HandledText status={bid?.status} />
				</Flex>
			) : (
				<Flex>
					<Box>
						<AnswerBid
							mutationLoading={isAcceptBidLoading}
							mutation={() => handleAcceptBid()}
							buttonText="Accept bid"
							status="accept"
							statusText="Accept"
							buttonHoverColor="green.500"
							buttonHoverTextColor="white"
						/>
					</Box>
					<Spacer />
					<Box>
						<AnswerBid
							mutationLoading={isRejectBidLoading}
							mutation={() => handleRejectBid()}
							buttonText="Reject bid"
							status="reject"
							statusText="Reject"
							buttonHoverColor="red.500"
							buttonHoverTextColor="white"
						/>
					</Box>
				</Flex>
			)}
		</Box>
	);
};

function HandledText({ status }: HandledTextProps) {
	if (status === undefined) {
		return (
			<Text fontSize={'xl'} marginTop={4}>
				Status not available
			</Text>
		);
	} else if (status === 2) {
		return (
			<Text fontSize={'xl'} color={'red'} marginTop={4}>
				This offer has been <strong>rejected!</strong>
			</Text>
		);
	} else if (status === 3) {
		return (
			<Text fontSize={'xl'} color={'green'} marginTop={4}>
				This offer has been <strong>accepted!</strong>
			</Text>
		);
	} else {
		return (
			<Text fontSize={'xl'} marginTop={4}>
				Unknown status
			</Text>
		);
	}
}
