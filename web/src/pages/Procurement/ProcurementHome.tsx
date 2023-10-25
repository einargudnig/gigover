import React from 'react';
import styled from 'styled-components';
import { CardBaseLink } from '../../components/CardBase';
import { Button, Text, HStack, Flex, Grid, GridItem } from '@chakra-ui/react';
import { Tender } from '../../models/Tender';
import { handleFinishDate } from '../../utils/HandleFinishDate';
import { Center } from '../../components/Center';
import { useUserTenders } from '../../queries/useUserTenders';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { formatDateWithoutTime } from '../../utils/StringUtils';
import { Link } from 'react-router-dom';
import { NoProcurementFound } from '../../components/empty/NoProcurementFound';

const ProcurementCardStyled = styled(CardBaseLink)`
	width: 100%;
	max-width: 100%;
	height: auto;
	margin-bottom: 8px;

	h3 {
		margin-bottom: 16px;
		color: #000;
	}

	@media screen and (max-width: 768px) {
		width: 100%;
	}
`;

export const ProcurementHome = (): JSX.Element => {
	const { data, isLoading } = useUserTenders();
	// console.log(data);

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

	return (
		<>
			<Text mb={'2'}>
				This tab should be used for creating, managing, and reviewing tenders.
			</Text>

			{data.length <= 0 ? null : (
				<Flex>
					<Button my={'2'} mr={'2'}>
						<Link to={'/tender-offers'}>Tender offers</Link>
					</Button>
					<Text mt={'4'}>You can see the offers that have been submitted here</Text>
				</Flex>
			)}
			{isLoading ? (
				<Center>
					<LoadingSpinner />
				</Center>
			) : (
				<>
					{!data || data.length <= 0 ? (
						<NoProcurementFound />
					) : (
						data
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
									<ProcurementCardStyled to={`${t.tenderId}`} key={t.tenderId}>
										<Flex direction={'column'}>
											<Grid templateColumns="repeat(4, 1fr)" gap={1}>
												<GridItem colSpan={2}>
													<HStack>
														<Text as={'b'}>Project:</Text>
														<Text color={'black'}>{t.projectName}</Text>
													</HStack>
													<HStack>
														<Text as={'b'}>Tender description:</Text>
														<Text color={'black'}>{t.description}</Text>
													</HStack>
												</GridItem>
												<GridItem colSpan={1}>
													<HStack>
														<Text as={'b'}>Phone number:</Text>
														<Text color={'black'}>{t.phoneNumber}</Text>
													</HStack>
													<HStack>
														<Text as={'b'}>Tender status:</Text>
														<Text color={'black'}>{offerStatus}</Text>
													</HStack>
												</GridItem>
												<GridItem colSpan={1}>
													<HStack>{shouldDeliver(t)}</HStack>
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
									</ProcurementCardStyled>
								);
							})
					)}
				</>
			)}
		</>
	);
};
