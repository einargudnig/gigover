import {
	Box,
	Button,
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
	VStack
} from '@chakra-ui/react';
import { useRef } from 'react';
import { useParams } from 'react-router-dom';
import ReactToPdf from 'react-to-pdf';
import { Center } from '../../../../components/Center';
import { LoadingSpinner } from '../../../../components/LoadingSpinner';
import { GetOfferItem } from '../../../../models/Tender';

export const PublishedOffer = ({ offerData, isOfferLoading }): JSX.Element => {
	const ref = useRef<HTMLDivElement | null>(null);
	const { offerId } = useParams();
	const offerIdNumber = Number(offerId); // cast it here instead of in multiple places
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

	// function that takes the status and returns published if the status is 1, accepted if status is 2 and rejected if status is 3
	const status = () => {
		if (offer?.status === 0) {
			return <Text color={'gray'}>Unpublished</Text>;
		} else if (offer?.status === 1) {
			return <Text>Published</Text>;
		} else if (offer?.status === 2) {
			return (
				<Text fontSize={'lg'} color={'green'}>
					Accepted
				</Text>
			);
		} else if (offer?.status === 3) {
			return (
				<Text fontSize={'lg'} color={'red'}>
					Rejected
				</Text>
			);
		}
		return 'Unknown';
	};

	const answeredTest = () => {
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

	return (
		<>
			{isOfferLoading ? (
				<Center>
					<LoadingSpinner />
				</Center>
			) : (
				<>
					<div ref={ref} id={'my-offer'}>
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
					</div>

					<Flex alignItems={'center'} justifyContent={'center'} marginTop={'3'}>
						<Box>
							<ReactToPdf
								targetRef={ref}
								filename={`Gigover-published-offer-${offerIdNumber}.pdf`}
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
							<>{answeredTest()}</>
						</Box>
					</Flex>
				</>
			)}
		</>
	);
};
