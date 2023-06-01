import React, { useRef } from 'react';
import { useParams } from 'react-router-dom';
import {
	Button,
	Table,
	Td,
	Th,
	Thead,
	Tr,
	Tooltip,
	Divider,
	Box,
	Flex,
	HStack,
	VStack,
	Text,
	Tbody,
	Spacer
} from '@chakra-ui/react';
import { GetOfferItem } from '../../../../models/Tender';
import { LoadingSpinner } from '../../../../components/LoadingSpinner';
import ReactToPdf from 'react-to-pdf';

export const PublishedOffer = ({ offerData, isOfferLoading }): JSX.Element => {
	const ref = useRef<HTMLDivElement | null>(null);
	const { offerId } = useParams();
	const offerIdNumber = Number(offerId); // for the pdf name
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

	return (
		<>
			{isOfferLoading ? (
				<div>
					<LoadingSpinner />
				</div>
			) : (
				<>
					<div ref={ref} id={'published-offer'}>
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
										</VStack>

										<HStack mb={'4'}>
											<VStack mr={'3'}>
												<HStack>
													<Text fontWeight={'bold'} fontSize={'xl'}>
														Notes:
													</Text>
													<Text fontSize={'lg'}>{offer?.note}</Text>
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
									<Tooltip label="Item number">
										<Th>Number</Th>
									</Tooltip>

									<Tooltip label="Description of the items">
										<Th>Description</Th>
									</Tooltip>

									<Tooltip label="Volume, how many items">
										<Th>Volume</Th>
									</Tooltip>

									<Tooltip label="The measurement of unit for items">
										<Th>Unit</Th>
									</Tooltip>

									{/* <Tooltip label="The cost of one item">
										<Th>Product number</Th>
									</Tooltip> */}

									<Tooltip label="The cost of one item">
										<Th>Cost pr item</Th>
									</Tooltip>

									<Tooltip label="Total cost of the item. Volume, multiplied with cost per item">
										<Th>Total cost</Th>
									</Tooltip>

									<Tooltip label="Notes/certifications for the items.">
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
									<Td>Total cost</Td>
									<Td>{formatNumber(totalCost())}</Td>
									<Td></Td>
								</Tr>
							</Tbody>
						</Table>
					</div>

					<Flex mx={'5'}>
						<Box>
							<Text mt={'4'} textColor={'gray-500'} fontSize={'large'}>
								This is the published offer!
							</Text>
						</Box>
						<Spacer />
						<Box>
							<Flex>
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
										<Button mr={'1'} onClick={toPdf}>
											Download as PDF
										</Button>
									)}
								</ReactToPdf>
								{/* <Spacer />
								<Button ml={'1'}>
									<Text textColor={'black'}>Download as CSV</Text>
								</Button> */}
							</Flex>
						</Box>
					</Flex>
				</>
			)}
		</>
	);
};
