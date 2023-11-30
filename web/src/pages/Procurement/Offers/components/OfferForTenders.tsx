import React from 'react';
import styled from 'styled-components';
import { CardBaseLink } from '../../../../components/CardBase';
import { Center, Flex, Text, HStack, Grid, GridItem } from '@chakra-ui/react';
import { useUserTenders } from '../../../../queries/useUserTenders';
import { LoadingSpinner } from '../../../../components/LoadingSpinner';
import { formatDateWithoutTime } from '../../../../utils/StringUtils';
import { handleFinishDate } from '../../../../utils/HandleFinishDate';

const ProcurementCardStyled = styled(CardBaseLink)`
	width: 100%;
	max-width: 100%;
	height: auto;
	display: flex;
	justify-content: space-between;
	flex-direction: column;
	margin-bottom: 4px;

	h3 {
		margin-bottom: 16px;
		color: #000;
	}

	@media screen and (max-width: 768px) {
		width: 100%;
	}
`;

export const OfferForTenders = (): JSX.Element => {
	const { data: userTenders, isLoading } = useUserTenders();
	console.log('userTenders', userTenders);
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

	return (
		<>
			<Text mb={'2'} fontSize={'xl'}>
				Press the tender to see the offers that have been published
			</Text>

			{isLoading ? (
				<Center>
					<LoadingSpinner />
				</Center>
			) : (
				<>
					{userTenders
						.slice()
						.reverse()
						.map((t) => (
							<ProcurementCardStyled
								to={`/tender/tender-offer/${t.tenderId}`}
								key={t.tenderId}
							>
								<Flex direction={'column'}>
									<Grid templateColumns="repeat(2, 1fr)" gap={1}>
										<GridItem colSpan={2}>
											<HStack>
												<Text as={'b'}>Project:</Text>
												<Text color={'black'}>{t.projectName}</Text>
											</HStack>
											<HStack>
												<Text as={'b'}>Description:</Text>
												<Text color={'black'}>{t.description}</Text>
											</HStack>
										</GridItem>
										<GridItem colSpan={1}>
											{finishDateStatus(t.finishDate)}
										</GridItem>
									</Grid>
								</Flex>
							</ProcurementCardStyled>
						))}
				</>
			)}
		</>
	);
};
