import { Box, Button, Flex, Spacer, Text } from '@chakra-ui/react';
import { useRef } from 'react';
import { useParams } from 'react-router-dom';
import ReactToPdf from 'react-to-pdf';
import { Center } from '../../../../components/Center';
import { LoadingSpinner } from '../../../../components/LoadingSpinner';
import { GetOfferItem } from '../../../../models/Tender';
import { Info } from '../../components/Info';
import { DataTable } from '../../components/Table';

export const PublishedOffer = ({ offerData, isOfferLoading }): JSX.Element => {
	const ref = useRef<HTMLDivElement | null>(null);
	const { offerId } = useParams();
	const offer = offerData?.offer;
	const offerItems: GetOfferItem[] | undefined = offerData?.offer.items;

	const answeredText = () => {
		if (offer?.status === 2) {
			return (
				<Text fontSize={'xl'} color={'green'}>
					This offer has been <strong>accepted!</strong>
				</Text>
			);
		} else if (offer?.status === 3) {
			return (
				<Text fontSize={'xl'} color={'red'}>
					This offer has been <strong>rejected!</strong>
				</Text>
			);
		} else {
			return null;
		}
	};

	const status = () => {
		if (offer?.status === 1) {
			return 'Published';
		} else if (offer?.status === 2) {
			return 'Accepted';
		} else if (offer?.status === 3) {
			return 'Rejected';
		}
		return 'Unknown';
	};

	const offerFields = [
		{ label: 'Bidder email', value: offer?.email },
		{ label: 'Bidder name', value: offer?.name },
		{ label: 'Offer status', value: status() },
		{ label: 'Notes', value: offer?.notes }
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
		<>
			{isOfferLoading ? (
				<Center>
					<LoadingSpinner />
				</Center>
			) : (
				<>
					<div ref={ref} id={'my-offer'}>
						<Info fields={offerFields} />
						<DataTable columns={columns} data={offerItems || []} showTotalCost={true} />
					</div>

					<Flex alignItems={'center'} justifyContent={'center'} marginTop={'3'}>
						<Box>
							<ReactToPdf
								targetRef={ref}
								filename={`Gigover-published-offer-${Number(offerId)}.pdf`}
								options={
									ref.current && {
										orientation: 'landscape',
										unit: 'px',
										hotfixes: ['px-scaling'],
										format: [
											ref.current?.clientWidth ?? 1920,
											ref.current?.clientHeight ?? 1080
										]
									}
								}
							>
								{({ toPdf }) => (
									<Button
										variant={'outline'}
										colorScheme={'black'}
										mr={'1'}
										onClick={toPdf}
									>
										Download as PDF
									</Button>
								)}
							</ReactToPdf>
						</Box>

						<Spacer />
						<Box>
							<>{answeredText()}</>
						</Box>
					</Flex>
				</>
			)}
		</>
	);
};
