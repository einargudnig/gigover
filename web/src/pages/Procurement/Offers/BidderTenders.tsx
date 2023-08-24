import React, { useMemo } from 'react';
import styled from 'styled-components';
import { Text, VStack, HStack, Flex, Grid, GridItem } from '@chakra-ui/react';
import { CardBaseLink } from '../../../components/CardBase';
import { Page } from '../../../components/Page';
import { useGetBidderTenders } from '../../../queries/useGetBidderTenders';
import { LoadingSpinner } from '../../../components/LoadingSpinner';
import { formatDateWithoutTime } from '../../../utils/StringUtils';
import { Tender } from '../../../models/Tender';
import { handleFinishDate } from '../../../utils/HandleFinishDate';
import { Center } from '../../../components/Center';

const Container = styled.div`
	flex: 1 0;
	height: 100%;
	padding: ${(props) => props.theme.padding(3)};
	overflow-y: auto;
`;

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

export const BidderTenders = (): JSX.Element => {
	const { data: tenders, isLoading } = useGetBidderTenders();
	// console.log(tenders);

	const getUniqueTenders = useMemo(() => {
		return () => {
			const uniqueTenders: Tender[] = [];

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
			<HStack>
				<Text as={'b'}>Close date:</Text>
				<Text>{formatDateWithoutTime(new Date(finishDate))}</Text>
			</HStack>
		);
	};

	const shouldDeliver = (tender: Tender) => {
		if (tender.status === 1) {
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

	// const offerPublished = () => {
	// 	const i = offers?.[0];
	// 	return i.status === 1 ? 'Published' : 'Not Published';
	// };

	return (
		<>
			<Page title={'Bidder tenders'} contentPadding={false}>
				<VStack style={{ height: '100%' }}>
					<HStack style={{ flex: 1, height: '100%', width: '100%' }}>
						<Container>
							{isLoading ? (
								<Center>
									<LoadingSpinner />
								</Center>
							) : (
								<>
									{noTender ? (
										<Center>
											<Text my={'2'} fontSize={'xl'}>
												You do not have any tenders yet. The Tender owner
												needs to add you to the tender.
											</Text>
										</Center>
									) : (
										<>
											{uniqueTenders.map((t) => {
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
														to={`/tender/offers/${t.tenderId}`}
														key={t.tenderId}
													>
														<Flex direction={'column'}>
															<Grid
																templateColumns="repeat(4, 1fr)"
																gap={1}
															>
																<GridItem colSpan={2}>
																	<HStack>
																		<Text as={'b'}>
																			Project:
																		</Text>
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
																		<Text as={'b'}>
																			Phone number:
																		</Text>
																		<Text color={'black'}>
																			{t.phoneNumber}
																		</Text>
																	</HStack>
																	<HStack>
																		<Text as={'b'}>
																			Tender status:
																		</Text>
																		<Text color={'black'}>
																			{offerStatus}
																		</Text>
																	</HStack>
																</GridItem>
																<GridItem colSpan={1}>
																	<HStack>
																		<Text as={'b'}>
																			Number of items:
																		</Text>
																		<Text color={'black'}>
																			{t.items.length}
																		</Text>
																	</HStack>
																	<HStack>
																		{shouldDeliver(t)}
																	</HStack>
																</GridItem>
															</Grid>
															<div>
																<p
																	style={{
																		marginBottom: -16,
																		fontSize: 14
																	}}
																>
																	{finishDateStatus(t.finishDate)}
																</p>
															</div>
														</Flex>
													</OfferCardStyled>
												);
											})}
										</>
									)}
								</>
							)}
						</Container>
					</HStack>
				</VStack>
			</Page>
		</>
	);
};
