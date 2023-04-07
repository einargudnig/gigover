import React from 'react';
import styled from 'styled-components';
import { Center, Text, VStack, HStack } from '@chakra-ui/react';
import { CardBaseLink } from '../../../components/CardBase';
import { Page } from '../../../components/Page';
import { useGetBidderTenders } from '../../../queries/useGetBidderTenders';
import { LoadingSpinner } from '../../../components/LoadingSpinner';
import { useProjectList } from '../../../queries/useProjectList';
import { formatDateWithoutTime } from '../../../utils/StringUtils';

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

export const BidderTenders = (): JSX.Element => {
	const { data: bidderTenders, isLoading } = useGetBidderTenders();
	const { data: projects } = useProjectList();

	// Get the projectNames from projects and add them to the tenders
	const projectsWithTenders = bidderTenders?.map((t) => {
		const projectName = projects.find((p) => p.projectId === t.projectId);
		return { ...t, projectName };
	});

	const noTender = projectsWithTenders?.length === 0;

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
							{noTender ? (
								<Center>
									<Text my={'2'} fontSize={'xl'}>
										You do not have any tenders yet. The Tender owner needs to
										add you to the tender.
									</Text>
								</Center>
							) : null}
							{isLoading ? (
								<Center>
									<LoadingSpinner />
								</Center>
							) : (
								<>
									{projectsWithTenders.map((t) => (
										<OfferCardStyled
											to={`/tender/offers/${t.tenderId}`}
											key={t.tenderId}
										>
											<OfferCardTitle>
												<div>
													<h3>
														<b>Project:</b> {t.projectName?.name}
													</h3>
													<div style={{ marginTop: -16 }}>
														<b>Description:</b> {t.description}
													</div>
												</div>
											</OfferCardTitle>
											<div>
												<p style={{ marginBottom: -16, fontSize: 14 }}>
													<b>Close date:</b>{' '}
													{formatDateWithoutTime(new Date(t.finishDate))}
												</p>
											</div>
										</OfferCardStyled>
									))}
								</>
							)}
						</Container>
					</HStack>
				</VStack>
			</Page>
		</>
	);
};
