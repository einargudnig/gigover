import React from 'react';
import styled from 'styled-components';
import { CardBaseLink } from '../../../../components/CardBase';
import { Center, Text } from '@chakra-ui/react';
import { useUserTenders } from '../../../../queries/useUserTenders';
import { LoadingSpinner } from '../../../../components/LoadingSpinner';
import { formatDateWithoutTime } from '../../../../utils/StringUtils';

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
					{userTenders.map((t) => (
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
									<b>Close date:</b>{' '}
									{formatDateWithoutTime(new Date(t.finishDate))}
								</p>
							</div>
						</ProcurementCardStyled>
					))}
				</>
			)}
		</>
	);
};
