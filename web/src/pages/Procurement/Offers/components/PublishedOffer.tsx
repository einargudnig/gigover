import {
	Box,
	Button,
	Flex,
	Spacer,
	Table,
	Tbody,
	Td,
	Text,
	Th,
	Thead,
	Tooltip,
	Tr
} from '@chakra-ui/react';
import { useRef } from 'react';
import { useParams } from 'react-router-dom';
import ReactToPdf from 'react-to-pdf';
import { Center } from '../../../../components/Center';
import { LoadingSpinner } from '../../../../components/LoadingSpinner';
import { GetOfferItem } from '../../../../models/Tender';
import { Info } from '../../components/Info';

export const PublishedOffer = ({ offerData, isOfferLoading }): JSX.Element => {
	const ref = useRef<HTMLDivElement | null>(null);
	const { offerId } = useParams();
	const offer = offerData?.offer;
	const offerItems: GetOfferItem[] | undefined = offerData?.offer.items;

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
