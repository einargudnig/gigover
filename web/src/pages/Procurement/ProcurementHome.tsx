import React from 'react';
import styled from 'styled-components';
// import { colorGenerator } from '../../hooks/colorGenerator';
import { CardBaseLink } from '../../components/CardBase';
// import { SimpleGrid } from '../../components/SimpleGrid';
import { Center } from '@chakra-ui/react';
// import { ProcurementFolder } from './components/ProcurementFolder';
import { useUserTenders } from '../../queries/useUserTenders';
import { useProjectList } from '../../queries/useProjectList';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { formatDateWithoutTime } from '../../utils/StringUtils';

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

export const ProcurementHome = (): JSX.Element => {
	const { data, isLoading } = useUserTenders();
	const { data: projects } = useProjectList();
	// console.log('DATA', { data });

	// Get the projectNames from projects and add them to the tenders
	const projectsWithTenders = data?.map((t) => {
		const projectName = projects.find((p) => p.projectId === t.projectId);
		return { ...t, projectName };
	});

	return (
		<>
			{isLoading ? (
				<Center>
					<LoadingSpinner />
				</Center>
			) : (
				<>
					{projectsWithTenders.map((t) => (
						<ProcurementCardStyled to={`${t.tenderId}`} key={t.tenderId}>
							<ProcurementCardTitle>
								<div>
									<h3>
										<b>Project:</b> {t.projectName?.name}
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
