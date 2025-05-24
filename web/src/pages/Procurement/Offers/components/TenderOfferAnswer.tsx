import { ArrowBackIcon } from '@chakra-ui/icons';
import { Box, Button, Flex, Heading, Spacer, Text, VStack, useToast } from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';
import { Center } from '../../../../components/Center';
import { LoadingSpinner } from '../../../../components/LoadingSpinner';
import { EmptyState } from '../../../../components/empty/EmptyState';
import { GetOfferItem, TenderDocument } from '../../../../models/Tender';
import { useAcceptOffer } from '../../../../mutations/procurement/useAcceptOffer';
import { useRejectOffer } from '../../../../mutations/procurement/useRejectOffer';
import { useGetOfferByOfferId } from '../../../../queries/procurement/useGetOfferByOfferId';
import { useGetTenderById } from '../../../../queries/procurement/useGetTenderById';
import { handleFinishDate } from '../../../../utils/HandleFinishDate';
import { OtherGigoverFile } from '../../../Files/new/components/OtherFile';
import { Info } from '../../components/Info';
import { DataTable } from '../../components/Table';
import { HandlingOfferConfirmation } from './HandlingOfferConfirmation';

export const TenderOfferAnswer = (): JSX.Element => {
	const { offerId } = useParams();
	const navigate = useNavigate();
	const { data: offerData, isPending } = useGetOfferByOfferId(Number(offerId));

	const offer = offerData?.offer;
	const offerItems = offerData?.offer.items;
	console.log('offerItems', offerItems);

	const offerDocuments = offerData?.offer.documents;

	const status = () => {
		if (offer?.status === 0) {
			return 'Unpublished';
		} else if (offer?.status === 1) {
			return 'Published';
		}
		return 'Unknown';
	};

	const offerFields = [
		{ label: 'Bidder Email', value: offer?.email },
		{ label: 'Bidder Name', value: offer?.name },
		{ label: 'Offer status', value: status() },
		{ label: 'Notes', value: offer?.notes }
	];

	const columns = [
		{ header: 'Number', accessor: 'nr', tooltip: 'Cost code', width: '20%' },
		{
			header: 'Description',
			accessor: 'description',
			tooltip: 'Description of a item',
			width: '16%'
		},
		{ header: 'Volume', accessor: 'volume', tooltip: 'Volume', width: '20%' },
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
			header: 'Total cost',
			accessor: 'totalCost',
			tooltip: 'Total cost of the item. Volume, multiplied with cost per item',
			width: '16%',
			isNumber: true
		},
		{
			header: 'Notes/Certifications/GWP',
			accessor: 'note',
			tooltip: 'Notes/certifications/gwp for the items.',
			width: '16%'
		}
	];

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
			{isPending ? (
				<Center>
					<LoadingSpinner />
				</Center>
			) : (
				<Box>
					<Info fields={offerFields} />
					<DataTable<GetOfferItem>
						columns={columns}
						data={offerItems ?? []}
						showTotalCost={true}
					/>
					<HandleOfferButtons offerId={Number(offerId)} offer={offer} />
					<OfferDocuments offerDocuments={offerDocuments ?? []} />
				</Box>
			)}
		</Box>
	);
};

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
	const { mutateAsync: acceptOffer, isPending: isAcceptLoading } = useAcceptOffer();
	const { mutateAsync: rejectOffer, isPending: isRejectLoading } = useRejectOffer();

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
