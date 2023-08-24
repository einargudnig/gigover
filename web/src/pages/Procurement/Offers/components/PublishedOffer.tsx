import React, { useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
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
	Spacer,
	useToast
} from '@chakra-ui/react';
import { Center } from '../../../../components/Center';
import { GetOfferItem } from '../../../../models/Tender';
import { LoadingSpinner } from '../../../../components/LoadingSpinner';
import ReactToPdf from 'react-to-pdf';
import { HandlingOfferConfirmation } from './HandlingOfferConfirmation';
import { useAcceptOffer } from '../../../../mutations/useAcceptOffer';
import { useRejectOffer } from '../../../../mutations/useRejectOffer';

export const PublishedOffer = ({ offerData, isOfferLoading, showResultsButtons }): JSX.Element => {
	const ref = useRef<HTMLDivElement | null>(null);
	// console.log('Offer', { offerData });
	const { offerId } = useParams();
	const offerIdNumber = Number(offerId); // cast it here instead of in multiple places
	const offer = offerData?.offer;
	const offerItems: GetOfferItem[] | undefined = offerData?.offer.items;
	const { mutateAsync: acceptOffer, isLoading: isAcceptLoading } = useAcceptOffer();
	const { mutateAsync: rejectOffer, isLoading: isRejectLoading } = useRejectOffer();

	const toast = useToast();

	const handleAccept = () => {
		const offerIdBody = {
			offerId: offerIdNumber
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
			offerId: offerIdNumber
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
			return 'Unpublished';
		} else if (offer?.status === 1) {
			return 'Published';
		} else if (offer?.status === 2) {
			return 'Accepted';
		} else if (offer?.status === 3) {
			return 'Rejected';
		}
		return 'Unknown';
	};

	const removeButtonsIfHandled = () => {
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
			return (
				<Flex>
					<Box mr={'1'}>
						<HandlingOfferConfirmation
							mutationLoading={isAcceptLoading}
							mutation={() => handleAccept()}
							statusText={'Accept Offer'}
							status={'accept'}
							buttonText={'Accept'}
							offerId={offerIdNumber}
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
							offerId={offerIdNumber}
							email={offer?.email}
							name={offer?.name}
						/>
					</Box>
				</Flex>
			);
		}
	};

	const showHandledText = () => {
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
			return <Text>The tender owner has not handled this offer</Text>;
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
									<Td>
										<strong>Total cost</strong>
									</Td>
									<Td>{formatNumber(totalCost())}</Td>
									<Td></Td>
								</Tr>
							</Tbody>
						</Table>
					</div>

					<Flex mx={'5'} alignItems={'center'} justifyContent={'center'}>
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
								<Spacer />
								<Link to={`/files/tender/offers/${offerId}`}>
									<Button ml={'1'}>
										<Text textColor={'black'}>Uploaded files</Text>
									</Button>
								</Link>
							</Flex>
						</Box>

						<Spacer />
						<Box>
							{showResultsButtons ? (
								<>{removeButtonsIfHandled()}</>
							) : (
								<>{showHandledText()}</>
							)}
						</Box>
					</Flex>
				</>
			)}
		</>
	);
};
