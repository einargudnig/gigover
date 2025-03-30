import {
	Box,
	Flex,
	Grid,
	GridItem,
	HStack,
	Heading,
	Table,
	Tbody,
	Td,
	Text,
	Thead,
	Tooltip,
	Tr,
	VStack
} from '@chakra-ui/react';
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { LoadingSpinner } from '../../../components/LoadingSpinner';
import { EmptyState } from '../../../components/empty/EmptyState';
import { ImportantIcon } from '../../../components/icons/ImportantIcon';
import { FileUploadType } from '../../../models/FileUploadType';
import { Bidder, TenderDocument, TenderItem } from '../../../models/Tender';
import { handleFinishDate } from '../../../utils/HandleFinishDate';
import { OtherGigoverFile } from '../../Files/new/components/OtherFile';
import { DropZone } from '../Offers/components/UploadTenderDocuments';
import { Info } from '../components/Info';
import { DataTable } from '../components/Table';
import { InviteButton } from './InviteButton';

export const PublishedTender = ({ tender, getTenderLoading }): JSX.Element => {
	const { tenderId } = useParams();

	const time = tender?.finishDate;
	const finishDateStatus = handleFinishDate(time); // we use this to update the UI based on the finish date
	const bidders = tender?.bidders;
	const tenderDocuments = tender?.documents;

	const getUniqueBidders = useMemo(() => {
		return () => {
			const uniqueBidders: Bidder[] = [];

			bidders.forEach((bidder) => {
				const existingBidder = uniqueBidders.find((b) => b.email === bidder.email);
				if (!existingBidder) {
					uniqueBidders.push(bidder);
				}
			});

			return uniqueBidders;
		};
	}, [bidders]);

	const uniqueBidders = getUniqueBidders();

	const tenderDescForEmail = tender?.description;

	const tenderItems: TenderItem[] | undefined = tender?.items;

	const tenderFields = [
		{ label: 'Description', value: tender?.description },
		{ label: 'Terms', value: tender?.terms },
		{ label: 'Status', value: tender?.status === 1 ? 'Published' : 'Not published' },
		{ label: 'Address', value: tender?.address },
		{ label: 'Delivery', value: tender?.delivery ? 'Yes' : 'No' },
		{ label: 'Close date', value: tender?.finishDate },
		{ label: 'Phone', value: tender?.phoneNumber }
	];

	const columns = [
		{ header: 'Number', accessor: 'nr', tooltip: 'Cost code', width: '20%' },
		{
			header: 'Description',
			accessor: 'description',
			tooltip: 'Description of a item',
			width: '20%'
		},
		{ header: 'Volume', accessor: 'volume', tooltip: 'Volume', width: '20%' },
		{
			header: 'Unit',
			accessor: 'unit',
			tooltip: 'Unit of measurement. For example: m2, kg, t',
			width: '20%'
		}
	];

	return (
		<Box p={6}>
			<Box p={2}>
				<Flex direction={'column'}>
					<Box
						mb={1}
						p={4}
						borderRadius={8}
						borderColor={'#EFEFEE'}
						bg={'#EFEFEE'}
						w="100%"
					>
						<Grid templateColumns="repeat(2, 1fr)" gap={4}>
							<GridItem colSpan={1}>
								<Info fields={tenderFields} />
							</GridItem>
							<GridItem colSpan={1}>
								<Bidders
									uniqueBidders={uniqueBidders}
									getTenderLoading={getTenderLoading}
								/>
							</GridItem>
						</Grid>
					</Box>
				</Flex>
			</Box>

			{tenderItems && <DataTable columns={columns} data={tenderItems} />}

			<Flex alignItems={'center'} mt={'6'}>
				<Box>
					{finishDateStatus ? (
						<Text marginTop={'2'} marginBottom={'2'} color={'gray.500'}>
							The finish date has passed, you can&apos;t invite more bidders
						</Text>
					) : (
						<InviteButton tenderId={tenderId} tenderDesc={tenderDescForEmail} />
					)}
				</Box>
			</Flex>

			<TenderDocuments tenderId={Number(tenderId)} tenderDocuments={tenderDocuments} />
		</Box>
	);
};

function Bidders({
	uniqueBidders,
	getTenderLoading
}: {
	uniqueBidders: Bidder[];
	getTenderLoading: boolean;
}) {
	return (
		<Box marginRight={'6'}>
			<VStack ml={'3'}>
				<VStack>
					<Tooltip
						hasArrow
						label="Here you can see the bidders that have a Gigover account"
					>
						<HStack>
							<Text fontWeight={'bold'} fontSize={'xl'}>
								Bidders
							</Text>
							<ImportantIcon size={16} />
						</HStack>
					</Tooltip>
				</VStack>
				<VStack>
					<Table variant="simple" size="sm" colorScheme="black">
						<Thead>
							<Tr>
								<Td>Name</Td>
								<Td>Email</Td>
								<Td>Will make an offer</Td>
							</Tr>
						</Thead>
						<Tbody>
							{getTenderLoading ? (
								<LoadingSpinner />
							) : (
								uniqueBidders?.map((bidder) => {
									let offerStatus;
									let statusColor;
									if (bidder.status === 0) {
										// BidderReject
										offerStatus = 'No';
										statusColor = 'red';
									}
									if (bidder.status === 1) {
										// BidderAccept
										offerStatus = 'Yes';
										statusColor = 'green';
									}
									if (bidder.status === 2) {
										// BidderNotAnswered
										offerStatus = 'Not answered';
										statusColor = 'gray';
									}
									return (
										<Tr key={bidder.email}>
											<Td>
												<Text>{bidder.name}</Text>
											</Td>
											<Td>
												<Text>{bidder.email}</Text>
											</Td>
											<Td>
												<Text color={statusColor}>{offerStatus}</Text>
											</Td>
										</Tr>
									);
								})
							)}
						</Tbody>
					</Table>
				</VStack>
			</VStack>
		</Box>
	);
}

function TenderDocuments({
	tenderId,
	tenderDocuments
}: {
	tenderId: number;
	tenderDocuments: TenderDocument[];
}) {
	return (
		<Box>
			<Box p={2}>
				<DropZone
					propertyId={0}
					offerId={0}
					projectId={0}
					uploadType={FileUploadType.Tender}
					tenderId={tenderId}
				/>
			</Box>
			{tenderDocuments!.length > 0 ? (
				<VStack style={{ width: '100%' }} align={'stretch'} spacing={4} mt={4}>
					<Heading size={'md'}>Files you added to this Tender</Heading>
					{tenderDocuments!
						.sort((a, b) => (b.created && a.created ? b.created - a.created : -1))
						.map((p, pIndex) => (
							<OtherGigoverFile key={pIndex} showDelete={false} file={p} />
						))}
				</VStack>
			) : (
				<EmptyState
					title={'No files uploaded'}
					text={'Upload files to this tender to share them with the bidders'}
				/>
			)}
		</Box>
	);
}
