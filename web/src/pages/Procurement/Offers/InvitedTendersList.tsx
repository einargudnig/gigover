import { Box, Flex, Grid, GridItem, HStack, Heading, Text, Tooltip } from '@chakra-ui/react';
import { useMemo } from 'react';
import styled from 'styled-components';
import { CardBaseLink } from '../../../components/CardBase';
import { Center } from '../../../components/Center';
import { CompleteTender } from '../../../models/Tender';
import { useGetBidderTenders } from '../../../queries/procurement/useGetBidderTenders';
import { handleFinishDate } from '../../../utils/HandleFinishDate';
import { formatDateWithoutTime } from '../../../utils/StringUtils';
import { ProcurementListSkeleton } from '../ProcurementListSkeleton';
const OfferCardStyled = styled(CardBaseLink)`
	width: 100%;
	max-width: 100%;
	height: auto;
	margin-bottom: 8px;
	margin-top: 8px;

	h3 {
		margin-bottom: 16px;
		color: #000;
	}

	@media screen and (max-width: 768px) {
		width: 100%;
	}
`;

export const InvitedTendersList = (): JSX.Element => {
	const { data: tenders, isPending } = useGetBidderTenders();

	const getUniqueTenders = useMemo(() => {
		return () => {
			const uniqueTenders: CompleteTender[] = [];

			tenders.forEach((tender) => {
				const existingTender = uniqueTenders.find((t) => t.tenderId === tender.tenderId);
				if (!existingTender) {
					uniqueTenders.push(tender);
				}
			});

			return uniqueTenders;
		};
	}, [tenders]);

	const uniqueTenders = getUniqueTenders();
	const noTender = uniqueTenders?.length === 0;

	const finishDateStatus = (finishDate: number) => {
		const res = handleFinishDate(finishDate);

		if (res === true) {
			return (
				<HStack>
					<Text>Tender was closed on:</Text>
					<Text>{formatDateWithoutTime(new Date(finishDate))}</Text>
				</HStack>
			);
		}
		return (
			<Tooltip hasArrow label="Offers will not be answered until this date has passed">
				<HStack>
					<Text as={'b'}>Close date:</Text>
					<Text>{formatDateWithoutTime(new Date(finishDate))}*</Text>
				</HStack>
			</Tooltip>
		);
	};

	const shouldDeliver = (tender: CompleteTender) => {
		if (tender.delivery === 1) {
			return (
				<HStack>
					<Text as={'b'}>Deliver to:</Text>
					<Text color={'black'}>{tender.address}</Text>
				</HStack>
			);
		}
		return (
			<HStack>
				<Text as={'b'}>Address:</Text>
				<Text color={'black'}>{tender.address}</Text>
			</HStack>
		);
	};

	const renderBidStatus = (tender: CompleteTender) => {
		if (tender.bidStatus === 0) {
			return <Text color={'red'}>Will not make an offer</Text>;
		} else if (tender.bidStatus === 1) {
			return <Text color={'green'}>Offer opened</Text>;
		} else if (tender.bidStatus === 2) {
			return <Text color={'gray'}>Not answered</Text>;
		} else {
			return null;
		}
	};

	// This is to make sure the flow of the bidder-tenders page is correct.
	// If the bidder opens an offer, he should be redirected to the offer page.
	// and if he goes back to this page he can click the tender and be redirected to the bidder-offers page.
	// If the bidder decides to not make an offer, he should be redirected this page and he cannot go anywhere else.
	// If the bidder hasn't decided he can go to the offers page and answer offer.
	const handleLinkFromStatus = (tender: CompleteTender) => {
		if (tender.bidStatus === 0) {
			return '#';
		} else if (tender.bidStatus === 1) {
			return '/tender/my-offers'; // I should send you to the offer, but I don't have the offer id. -> should I build a context (again) to access it.
		} else if (tender.bidStatus === 2) {
			return `/tender/invitations/${tender.tenderId}`;
		} else {
			return null;
		}
	};

	return (
		<Box p={4}>
			<Flex justify={'start'}>
				<Heading size={'md'}>You have been invited to add offers to these tenders</Heading>
			</Flex>

			{isPending ? (
				<ProcurementListSkeleton />
			) : (
				<>
					{noTender ? (
						<Center>
							<Text fontSize={'xl'}>
								You do not have any tenders yet. The Tender owner needs to add you
								to the tender.
							</Text>
						</Center>
					) : (
						<>
							{uniqueTenders
								.slice()
								.reverse()
								.map((t) => {
									let offerStatus;
									if (t.status === 0) {
										offerStatus = 'Unpublished';
									} else if (t.status === 1) {
										offerStatus = 'Published';
									} else {
										offerStatus = 'Unknown';
									}

									return (
										<OfferCardStyled
											to={handleLinkFromStatus(t) || '#'}
											key={t.tenderId}
										>
											<Flex direction={'column'}>
												<Grid templateColumns="repeat(4, 1fr)" gap={1}>
													<GridItem colSpan={2}>
														<HStack>
															<Text as={'b'}>Project:</Text>
															<Text color={'black'}>
																{t.projectName}
															</Text>
														</HStack>
														<HStack>
															<Text as={'b'}>
																Tender description:
															</Text>
															<Text color={'black'}>
																{t.description}
															</Text>
														</HStack>
													</GridItem>
													<GridItem colSpan={1}>
														<HStack>
															<Text as={'b'}>Phone number:</Text>
															<Text color={'black'}>
																{t.phoneNumber}
															</Text>
														</HStack>
														<HStack>
															<Text as={'b'}>Tender status:</Text>
															<Text color={'black'}>
																{offerStatus}
															</Text>
														</HStack>
													</GridItem>
													<GridItem colSpan={1}>
														<HStack>
															<Text as={'b'}>Number of items:</Text>
															<Text color={'black'}>
																{t.items.length}
															</Text>
														</HStack>
														<HStack>{shouldDeliver(t)}</HStack>
													</GridItem>
													<GridItem colSpan={2}>
														<p
															style={{
																marginBottom: -16,
																fontSize: 14
															}}
														>
															{finishDateStatus(t.finishDate)}
														</p>
													</GridItem>
													<GridItem colSpan={1} />
													<GridItem colSpan={1}>
														<HStack>
															<Text as={'b'}>Bid status:</Text>
															<Text>{renderBidStatus(t)}</Text>
														</HStack>
													</GridItem>
												</Grid>
											</Flex>
										</OfferCardStyled>
									);
								})}
						</>
					)}
				</>
			)}
		</Box>
	);
};
