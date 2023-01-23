import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { Button, HStack, VStack } from '@chakra-ui/react';
import { Page } from '../../components/Page';
import { useProjectList } from '../../queries/useProjectList';
import { LoadingSpinner } from '../../components/LoadingSpinner';
// import { Project } from '../../models/Project';
import { Outlet } from 'react-router-dom';
import { ProcurementModal } from '../../components/modals/ProcurementModal';
// import { useOpenProjects } from '../../hooks/useAvailableProjects';
import { PlusIcon } from '../../components/icons/PlusIcon';
import { ModalContext } from '../../context/ModalContext';

const Container = styled.div`
	flex: 1 0;
	height: 100%;
	padding: ${(props) => props.theme.padding(3)};
	overflow-y: auto;
`;

export const Procurement = (): JSX.Element => {
	const [, setModalContext] = useContext(ModalContext);
	const { data, isLoading } = useProjectList();
	// const [project, setProject] = useState<Project | null>(null);
	// I need to access the upload state in the modal? How do I do that?

	return (
		<>
			{/* {upload && <ProcurementModal />} */}
			<Page
				title={'Procurement'}
				contentPadding={false}
				actions={
					<>
						{/* by adding addTender as a parameter to the setModalContext I'm  `selecting` what modal to use.
						 * Why is the modal still empty?
						 */}
						<Button
							onClick={() => setModalContext({ addTender: { tender: undefined } })}
							leftIcon={<PlusIcon />}
						>
							New Procurement
						</Button>
					</>
				}
			>
				<VStack style={{ height: '100%' }}>
					{isLoading ? (
						<LoadingSpinner />
					) : (
						<HStack style={{ flex: 1, height: '100%', width: '100%' }}>
							<Container>
								<Outlet />
							</Container>
						</HStack>
					)}
				</VStack>
			</Page>
		</>
	);
};
