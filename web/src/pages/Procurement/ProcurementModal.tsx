import React, { useState } from 'react';
import { Heading, Text, VStack } from '@chakra-ui/react';
import styled from 'styled-components';
import { Modal } from '../../components/Modal';
import { FormActions } from '../../components/FormActions';
import { useOpenProjects } from '../../hooks/useAvailableProjects';
import { TrackerSelect } from '../../components/TrackerSelect';
import { useProjectList } from '../../queries/useProjectList';

interface ProcurementModalProps {
	onClose: () => void;
	onComplete: (status: boolean) => void;
	procurementId?: number;
	projectId?: number;
}

const ProcurementModalStyled = styled.div`
	@media screen and (max-width: 500px) {
		width: 500px;
	}
`;

export const ProcurementModal = ({
	procurementId,
	projectId,
	onClose,
	onComplete
}: ProcurementModalProps): JSX.Element => {
	const { data } = useProjectList();
	const openProjects = useOpenProjects(data);
	const [selectedProject, setSelectedProject] = useState<number | undefined>(projectId);

	return (
		<Modal open={true} onClose={onClose} title={'New Procurement'}>
			<ProcurementModalStyled>
				<VStack mb={-6} align={'stretch'}>
					{openProjects ? (
						<>
							<Heading size={'md'}>Select a project for your procurement</Heading>
							<TrackerSelect
								title={'Select a project'}
								value={selectedProject}
								options={openProjects.map((project) => ({
									label: project.name,
									value: project.projectId
								}))}
								valueChanged={(newValue) => {
									if (newValue === '') {
										setSelectedProject(undefined);
									} else {
										setSelectedProject((newValue as number) ?? undefined);
									}
								}}
							/>
						</>
					) : (
						<>
							<Heading>No projects</Heading>
							<Text>
								You do not have any projects, you have to create a project before
								you can make a procurement
							</Text>
						</>
					)}
					<FormActions cancelText={'Close'} submitText={'Create'} />
				</VStack>
			</ProcurementModalStyled>
		</Modal>
	);
};
