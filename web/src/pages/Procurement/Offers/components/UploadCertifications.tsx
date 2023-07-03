import { Heading, Text, VStack } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Modal } from '../../../../components/Modal';
import { FormActions } from '../../../../components/FormActions';
import { DropZone } from '../../../../components/DropZone';

interface UploadModalProps {
	onClose: () => void;
	onComplete: (status: boolean) => void;
	offerId: number;
	tenderId: number;
}

const UploadModalStyled = styled.div`
	@media screen and (max-width: 500px) {
		width: 500px;
	}
`;

// What am doing with this?
// I need the projectId and folderId to be able to upload the file?
// maybe I will need to prop drill that to the DropZone component
const selectedProject = 1;
const selectedFolder = 1;

export const UploadCertifications = ({
	onClose,
	offerId,
	tenderId
}: UploadModalProps): JSX.Element => {
	return (
		<Modal open={true} onClose={onClose} centerModal={true} title={'Upload file for offer'}>
			<UploadModalStyled>
				<VStack mb={-6} align={'stretch'}>
					<DropZone projectId={selectedProject} folderId={selectedFolder} />
					<FormActions
						hideSubmitButton={true}
						submitText={'Upload'}
						cancelText={'Cancel'}
						onCancel={() => {
							onClose();
						}}
					/>
				</VStack>
			</UploadModalStyled>
		</Modal>
	);
};
