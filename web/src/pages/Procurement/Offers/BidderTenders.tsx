import React, { useMemo } from 'react';
import styled from 'styled-components';
import { Center, Text, VStack, HStack } from '@chakra-ui/react';
import { CardBaseLink } from '../../../components/CardBase';
import { Page } from '../../../components/Page';
import { useGetBidderTenders } from '../../../queries/useGetBidderTenders';
import { LoadingSpinner } from '../../../components/LoadingSpinner';
import { formatDateWithoutTime } from '../../../utils/StringUtils';
import { Tender } from '../../../models/Tender';

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
	display: flex;
	justify-content: space-between;
	flex-direction: column;
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

const OfferCardTitle = styled.div`
	display: flex;
	justify-content: space-between;
`;

// const getUniqueTenders = (tenders: Tender[]) => {
// 	const uniqueTenders: Tender[] = [];

// 	tenders.forEach((tender) => {
// 		const existingTender = uniqueTenders.find((t) => t.tenderId === tender.tenderId);
// 		if (!existingTender) {
// 			uniqueTenders.push(tender);
// 		}
// 	});

// 	return uniqueTenders;
// };

export const BidderTenders = (): JSX.Element => {
	const { data: tenders, isLoading } = useGetBidderTenders();

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
											{uniqueTenders.map((t) => (
												<OfferCardStyled
													to={`/tender/offers/${t.tenderId}`}
													key={t.tenderId}
												>
													<OfferCardTitle>
														<div>
															<h3>
																<b>Project:</b> {t.projectName}
															</h3>
															<div style={{ marginTop: -16 }}>
																<b>Description:</b> {t.description}
															</div>
														</div>
													</OfferCardTitle>
													<div>
														<p
															style={{
																marginBottom: -16,
																fontSize: 14
															}}
														>
															<b>Close date:</b>{' '}
															{formatDateWithoutTime(
																new Date(t.finishDate)
															)}
														</p>
													</div>
												</OfferCardStyled>
											))}
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
