import { Box, Button, Flex, Spacer, Text } from '@chakra-ui/react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useRef } from 'react';
import { useParams } from 'react-router-dom';
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

	const handleDownloadPdf = async () => {
		const element = ref.current;
		if (!element) {
			console.error('Element not found for PDF generation');
			return;
		}

		try {
			const canvas = await html2canvas(element, {
				scale: 2, // Improves quality
				useCORS: true // If you have external images/resources
			});

			const imgData = canvas.toDataURL('image/png');

			// Use element's dimensions for PDF page size
			const pdfWidth = element.offsetWidth;
			const pdfHeight = element.offsetHeight;

			// Determine orientation: 'l' for landscape, 'p' for portrait
			const orientation = pdfWidth > pdfHeight ? 'l' : 'p';

			const pdf = new jsPDF({
				orientation: orientation,
				unit: 'px',
				format: [pdfWidth, pdfHeight],
				hotfixes: ['px_scaling'] // Attempt to replicate px-scaling behavior
			});

			pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
			pdf.save(`Gigover-published-offer-${Number(offerId)}.pdf`);
		} catch (error) {
			console.error('Error generating PDF:', error);
			// You might want to add some user-facing error notification here
		}
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
							<Button
								variant={'outline'}
								colorScheme={'black'}
								mr={'1'}
								onClick={handleDownloadPdf}
							>
								Download as PDF
							</Button>
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
