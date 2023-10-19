import React from 'react';
import styled from 'styled-components';
import { CardBaseLink } from '../../../../components/CardBase';
import { Center, Text, HStack } from '@chakra-ui/react';
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
	margin-bottom: 8px;

	h3 {
		margin-bottom: 16px;
		color: #000;
	}

	@media screen and (max-width: 768px) {
		width: 100%;
	}
`;

const ProcurementCardTitle = styled.div`
	display: flex;
	justify-content: space-between;
`;

export const OfferForTenders = (): JSX.Element => {
	const { data: userTenders, isLoading } = useUserTenders();

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
			<Center>
				<Text mb={'2'} fontSize={'xl'}>
					Press the tender to see the offers that have been published
				</Text>
			</Center>
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
							<ProcurementCardStyled to={`${t.tenderId}`} key={t.tenderId}>
								<ProcurementCardTitle>
									<div>
										<h3>
											<b>Project:</b> {t.projectName}
										</h3>
										<div style={{ marginTop: -16 }}>
											<b>Description:</b> {t.description}
										</div>
									</div>
								</ProcurementCardTitle>
								<div>
									<p style={{ marginBottom: -16, fontSize: 14 }}>
										{finishDateStatus(t.finishDate)}
									</p>
								</div>
							</ProcurementCardStyled>
						))}
				</>
			)}
		</>
	);
};
