import React, { useContext, useState } from 'react';
import styled from 'styled-components';
// import { colorGenerator } from '../../hooks/colorGenerator';
import { CardBaseLink } from '../../components/CardBase';
// import { SimpleGrid } from '../../components/SimpleGrid';
import { Center } from '@chakra-ui/react';
// import { ProcurementFolder } from './components/ProcurementFolder';
import { useUserTenders } from '../../queries/useUserTenders';
import { useProjectList } from '../../queries/useProjectList';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ModalContext } from '../../context/ModalContext';
import { Edit } from '../../components/icons/Edit';
import { TrashIcon } from '../../components/icons/TrashIcon';
import { Theme } from '../../Theme';

// For the deleting of a tender
import { ConfirmDialog } from '../../components/ConfirmDialog';

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

const ProcurementCardEdit = styled.div`
	width: 48px;
	height: 48px;
	border-radius: 50%;
	background: transparent;
	transition: all 0.2s linear;
	display: flex;
	justify-content: center;
	align-items: center;
	margin-top: -16px;
	margin-right: -16px;

	&:hover {
		background: ${(props) => props.theme.colors.blueBackground};
	}
`;

const ProcurementCardActions = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
`;

export const ProcurementHome = (): JSX.Element => {
	const [, setModalContext] = useContext(ModalContext); //! I still need to 'wire' this up. I think it's nice to be able to update this in the 'overview' page.
	const [dialogOpen, setDialogOpen] = useState(false);
	const { data, isLoading } = useUserTenders();
	const { data: projects } = useProjectList(); // Just to get the projectName :/

	// Get the projectNames from projects and add them to the tenders
	const projectsWithTenders = data.map((t) => {
		const projectName = projects.find((p) => p.projectId === t.projectId);
		return { ...t, projectName };
	});
	// console.log('HERE', projectsWithTenders);

	// I'm going to change the structure of this a little bit!
	// instead of showing one folder for each prroject i'm going to show a list of the tenders.
	// By clicking an item I will go and see the tenderItems.
	// I will keep the other structure commented out so i nthe future i could re-use it.

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
										<b>Description:</b> {t.description}
									</h3>
									<div style={{ marginTop: -16 }}>
										<b>Project:</b> {t.projectName?.name}
									</div>
								</div>
								<ProcurementCardActions>
									<ProcurementCardEdit
									// onClick={(event) => {
									// 	event.preventDefault();
									// 	setModalContext({ modifyTender: t });
									// }}
									>
										<Edit size={20} color={Theme.colors.darkLightBlue} />
									</ProcurementCardEdit>
									{/* <ConfirmDialog
										header={'Delete tender'}
										setIsOpen={setDialogOpen}
										callback={async (b) => {
											if (b) {
												await console.log('this should be deleted');
											}
											setDialogOpen(false);
										}}
										isOpen={dialogOpen}
									> */}
									<ProcurementCardEdit
										onClick={() => {
											setDialogOpen(true);
										}}
									>
										<TrashIcon size={20} color={Theme.colors.red} />
									</ProcurementCardEdit>
									{/* </ConfirmDialog> */}
								</ProcurementCardActions>
							</ProcurementCardTitle>
							<div>
								<p style={{ marginBottom: -16, fontSize: 14 }}>
									<b>terms:</b> {t.terms}
								</p>
							</div>
						</ProcurementCardStyled>
					))}
				</>
			)}
			{/* {isLoading ? (
				<Center>
					<LoadingSpinner />
				</Center>
			) : (
				<div>
					<VStack alignItems={'flex-start'} style={{ width: '100%' }} spacing={4}>
						<SimpleGrid itemWidth={320}>
							{
								// Map through the projectNames and make a ProcurementFolder for each projectid
								projectsWithTenders.map((p) => {
									return (
										<ProcurementFolder
											key={p.projectId}
											projectId={p.projectId}
											name={p?.projectName?.name}
										/>
									);
								})
							}
						</SimpleGrid>
					</VStack>
				</div>
			)} */}
		</>
	);
};
