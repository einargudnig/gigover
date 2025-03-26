import { ArrowBackIcon } from '@chakra-ui/icons';
import {
	Box,
	Button,
	Divider,
	Flex,
	HStack,
	Heading,
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
import { EmptyState } from '../../../../components/empty/EmptyState';
import { GetOffer, GetOfferItem, TenderDocument } from '../../../../models/Tender';
import { useAcceptOffer } from '../../../../mutations/procurement/useAcceptOffer';
import { useRejectOffer } from '../../../../mutations/procurement/useRejectOffer';
import { useGetOfferByOfferId } from '../../../../queries/procurement/useGetOfferByOfferId';
import { useGetTenderById } from '../../../../queries/procurement/useGetTenderById';
import { handleFinishDate } from '../../../../utils/HandleFinishDate';
import { OtherGigoverFile } from '../../../Files/new/components/OtherFile';
import { HandlingOfferConfirmation } from './HandlingOfferConfirmation';

export const TenderOfferAnswer = (): JSX.Element => {
	const { offerId } = useParams();
	const navigate = useNavigate();
	const { data: offerData, isLoading } = useGetOfferByOfferId(Number(offerId));

	const offer = offerData?.offer;
	const offerItems = offerData?.offer.items;

	const offerDocuments = offerData?.offer.documents;

	return (
		<Box p={4}>
			<Button
				onClick={() => navigate(-1)}
				variant={'link'}
				colorScheme={'gray'}
				fontSize={'lg'}
			>
				<ArrowBackIcon />
			</Button>
			{isLoading ? (
				<Center>
					<LoadingSpinner />
				</Center>
			) : (
				<Box>
					<OfferHeader offer={offer!} />
					<OfferItems offerItems={offerItems ?? []} />
					<HandleOfferButtons offerId={Number(offerId)} offer={offer} />
					<OfferDocuments offerDocuments={offerDocuments ?? []} />
				</Box>
			)}
		</Box>
	);
};

function OfferHeader({ offer }: { offer: GetOffer }) {
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
		<Flex direction={'column'}>
			<Box mb={2} p={4} borderRadius={8} borderColor={'#EFEFEE'} bg={'#EFEFEE'} w="100%">
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
	);
}

function OfferItems({ offerItems }: { offerItems: GetOfferItem[] }) {
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
	);
}

function OfferDocuments({ offerDocuments }: { offerDocuments: TenderDocument[] }) {
	return (
		<Box>
			{offerDocuments!.length > 0 ? (
				<VStack style={{ width: '100%' }} align={'stretch'} spacing={4} mt={4}>
					<Heading size={'md'}>Files you added to this Tender</Heading>
					{offerDocuments?.map((p, pIndex) => (
						<OtherGigoverFile key={pIndex} showDelete={false} file={p} />
					))}
				</VStack>
			) : (
				<EmptyState
					title={'No files uploaded'}
					text={'There are no files uploaded for this offer.'}
				/>
			)}
		</Box>
	);
}

function HandleOfferButtons({ offerId, offer }) {
	const { tenderId } = useParams();
	const { mutateAsync: acceptOffer, isLoading: isAcceptLoading } = useAcceptOffer();
	const { mutateAsync: rejectOffer, isLoading: isRejectLoading } = useRejectOffer();

	const { data: tenderData } = useGetTenderById(Number(tenderId));
	const tender = tenderData?.tender;

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

	// This return true when the finish date has passed
	// So we need to invert it here, we don't want the tender owner
	// To be able to answer offers until the finish date has passed
	const disableButtons = handleFinishDate(tender?.finishDate);

	return (
		<Box p={4}>
			{hasBeenAnswered ? (
				<Text fontSize={'xl'} color={statusColor}>
					This offer has been <strong>{statusMap}</strong>
				</Text>
			) : (
				<Flex alignItems={'center'}>
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
							disabled={!disableButtons}
						/>
					</Box>
					<Spacer />
					{!disableButtons ? (
						<Text color={'gray.700'}>
							You cannot answer offers before the close date!
						</Text>
					) : null}
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
							disabled={!disableButtons}
						/>
					</Box>
				</Flex>
			)}
		</Box>
	);
}
