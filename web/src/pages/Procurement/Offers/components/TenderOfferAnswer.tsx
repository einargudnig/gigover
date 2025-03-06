import {
	Box,
	Divider,
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
import { useParams } from 'react-router-dom';
import { Center } from '../../../../components/Center';
import { LoadingSpinner } from '../../../../components/LoadingSpinner';
import { useAcceptOffer } from '../../../../mutations/procurement/useAcceptOffer';
import { useRejectOffer } from '../../../../mutations/procurement/useRejectOffer';
import { useGetOfferByOfferId } from '../../../../queries/procurement/useGetOfferByOfferId';
import { HandlingOfferConfirmation } from './HandlingOfferConfirmation';

export const TenderOfferAnswer = (): JSX.Element => {
	const { offerId } = useParams();

	const { data: offerData, isLoading } = useGetOfferByOfferId(Number(offerId));

	const offer = offerData?.offer;
	const offerItems = offerData?.offer.items;

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

	// function that takes the status and returns published if the status is 1, accepted if status is 2 and rejected if status is 3
	const status = () => {
		if (offer?.status === 0) {
			return <Text color={'gray'}>Unpublished</Text>;
		} else if (offer?.status === 1) {
			return <Text>Published</Text>;
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
				<Box>
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
										<HStack>
											<Text fontWeight={'bold'} fontSize={'xl'}>
												Offer status:
											</Text>
											<Text fontSize={'lg'}>{status()}</Text>
										</HStack>
									</VStack>

									<HStack mb={'4'}>
										<VStack mr={'3'}>
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
								<Tooltip hasArrow label="Item number">
									<Th>Number</Th>
								</Tooltip>

								<Tooltip hasArrow label="Description of the items">
									<Th>Description</Th>
								</Tooltip>

								<Tooltip hasArrow label="Volume, how many items">
									<Th>Volume</Th>
								</Tooltip>

								<Tooltip hasArrow label="The measurement of unit for items">
									<Th>Unit</Th>
								</Tooltip>

								{/* <Tooltip hasArrow label="The cost of one item">
										<Th>Product number</Th>
									</Tooltip> */}

								<Tooltip hasArrow label="The cost of one item">
									<Th>Cost pr item</Th>
								</Tooltip>

								<Tooltip
									hasArrow
									label="Total cost of the item. Volume, multiplied with cost per item"
								>
									<Th>Total cost</Th>
								</Tooltip>

								<Tooltip hasArrow label="Notes/certifications for the items.">
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
									{/* <Td>{row.productNumber}</Td> */}
									<Td>{formatNumber(row.cost)}</Td>
									<Td>{formatNumber(row.totalCost)}</Td>
									<Td>{row.note}</Td>
								</Tr>
							))}
							<Tr>
								<Td></Td>
								<Td></Td>
								<Td></Td>
								<Td></Td>
								<Td>
									<strong>Total cost</strong>
								</Td>
								<Td>{formatNumber(totalCost())}</Td>
								<Td></Td>
							</Tr>
						</Tbody>
					</Table>
					<HandleOfferButtons offerId={Number(offerId)} offer={offer} />
				</Box>
			)}
		</Box>
	);
};

function HandleOfferButtons({ offerId, offer }) {
	const { mutateAsync: acceptOffer, isLoading: isAcceptLoading } = useAcceptOffer();
	const { mutateAsync: rejectOffer, isLoading: isRejectLoading } = useRejectOffer();

	const toast = useToast();

	const handleAccept = () => {
		const offerIdBody = {
			offerId: Number(offerId)
		};
		try {
			console.log('Accept offer with this body:', offerIdBody);
			acceptOffer(offerIdBody);
			toast({
				title: 'Offer accepted',
				description: 'You have accepted this offer!',
				status: 'info',
				duration: 3000,
				isClosable: true
			});
		} catch (error) {
			console.log(error);
			toast({
				title: 'Error',
				description: 'There was an error in accepting the offer.',
				status: 'error',
				duration: 2000,
				isClosable: true
			});
		}
	};

	const handleReject = () => {
		const offerIdBody = {
			offerId: Number(offerId)
		};
		console.log('Reject offer with this body:', offerIdBody);
		try {
			rejectOffer(offerIdBody);
			toast({
				title: 'Offer rejected',
				description: 'You have rejected this offer!',
				status: 'info',
				duration: 3000,
				isClosable: true
			});
		} catch (error) {
			console.log(error);
			toast({
				title: 'Error',
				description: 'There was an error in rejecting the offer.',
				status: 'error',
				duration: 2000,
				isClosable: true
			});
		}
	};

	const statusMap = {
		2: 'Accepted',
		3: 'Rejected'
	}[offer?.status || 'Unknown'];

	const statusColor = {
		2: 'green',
		3: 'red'
	}[offer?.status || 'black'];

	const hasBeenAnswered = offer?.status === 2 || offer?.status === 3;

	return (
		<Box p={4}>
			{hasBeenAnswered ? (
				<Text fontSize={'xl'} color={statusColor}>
					This offer has been <strong>{statusMap}</strong>
				</Text>
			) : (
				<Flex>
					<Box mr={'1'}>
						<HandlingOfferConfirmation
							mutationLoading={isAcceptLoading}
							mutation={() => handleAccept()}
							statusText={'Accept Offer'}
							status={'accept'}
							buttonText={'Accept'}
							offerId={Number(offerId)}
							email={offer?.email}
							name={offer?.name}
						/>
					</Box>
					<Spacer />
					<Box ml={'1'}>
						<HandlingOfferConfirmation
							mutationLoading={isRejectLoading}
							mutation={() => handleReject()}
							statusText={'Reject Offer'}
							status={'reject'}
							buttonText={'Reject'}
							offerId={Number(offerId)}
							email={offer?.email}
							name={offer?.name}
						/>
					</Box>
				</Flex>
			)}
		</Box>
	);
}
