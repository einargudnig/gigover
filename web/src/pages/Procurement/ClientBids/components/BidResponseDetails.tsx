import { ArrowBackIcon } from '@chakra-ui/icons';
import { Box, Button, Flex, Spacer, Text, useToast } from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';
import { Center } from '../../../../components/Center';
import { LoadingSpinner } from '../../../../components/LoadingSpinner';
import { Bid, BidItem } from '../../../../models/Tender';
import { useAcceptBid } from '../../../../mutations/procurement/client-bids/useAcceptBid';
import { useRejectBid } from '../../../../mutations/procurement/client-bids/useRejectBid';
import { useClientGetBidById } from '../../../../queries/procurement/client-bids/useGetClientBidById';
import { Info } from '../../components/Info';
import { DataTable } from '../../components/Table';
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
	// We want to show total cost on all cost tables!
	// TODO: make sure this comes from the API like it does in the tender offers!
	const bidItems = bid?.items?.map((item) => ({
		...item,
		totalCost: item?.cost ? item?.cost * (item?.volume || 0) : 0
	}));

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

	const status = () => {
		if (bid?.status === 0 || bid?.status === 1) {
			return 'Unanswered';
		} else if (bid?.status === 2) {
			return 'Rejected';
		} else if (bid?.status === 3) {
			return 'Accepted';
		}
		return 'Unknown';
	};

	const bidFields = [
		{ label: 'Description', value: bid?.description },
		{ label: 'Terms', value: bid?.terms },
		{ label: 'Status', value: status() },
		{ label: 'Address', value: bid?.address },
		{ label: 'Delivery', value: bid?.delivery ? 'Yes' : 'No' },
		{ label: 'Close date', value: bid?.finishDate },
		{ label: 'Email', value: bid?.bidderEmail },
		{ label: 'Name', value: bid?.bidderName },
		{ label: 'Notes', value: bid?.notes }
	];

	const columns = [
		{ header: 'Number', accessor: 'nr', tooltip: 'Cost code', width: '16%' },
		{
			header: 'Description',
			accessor: 'description',
			tooltip: 'Description of a item',
			width: '16%'
		},
		{ header: 'Volume', accessor: 'volume', tooltip: 'Volume', width: '16%' },
		{
			header: 'Unit',
			accessor: 'unit',
			tooltip: 'Unit of measurement. For example: m2, kg, t',
			width: '16%'
		},
		{
			header: 'Cost',
			accessor: 'cost',
			tooltip: 'Cost of single item',
			width: '16%',
			isNumber: true
		},
		{
			header: 'Total Cost',
			accessor: 'totalCost',
			tooltip: 'Total cost (Cost × Volume)',
			width: '20%',
			isNumber: true
		}
	];

	console.log('bid2', bid);

	return (
		<Box p={4}>
			{isLoading ? (
				<Center>
					<LoadingSpinner />
				</Center>
			) : (
				<>
					<Button
						onClick={() => navigate(-1)}
						variant={'link'}
						colorScheme={'gray'}
						fontSize={'lg'}
					>
						<ArrowBackIcon />
					</Button>
					<Box
						mb={1}
						p={4}
						borderRadius={8}
						borderColor={'#EFEFEE'}
						bg={'#EFEFEE'}
						w="100%"
					>
						<Info fields={bidFields} />
					</Box>
					<Box mb={1} p={4} borderRadius={8}>
						<DataTable<BidItem>
							columns={columns}
							data={bidItems || []}
							showTotalCost={true}
						/>
					</Box>
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
