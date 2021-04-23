import { VStack } from '@chakra-ui/react';
import React, { useState } from 'react';
import styled from 'styled-components';
import { Modal } from '../../components/Modal';
import { FormActions } from '../../components/FormActions';
import { DropZone } from '../../components/DropZone';

interface UploadModalProps {
	onClose: () => void;
	onComplete: (status: boolean) => void;
}

const UploadModalStyled = styled.div`
	@media screen and (max-width: 500px) {
		width: 500px;
	}
`;

export const UploadModal = ({ onClose }: UploadModalProps): JSX.Element => {
	const [isUploading] = useState(false);

	return (
		<Modal open={true} onClose={onClose} centerModal={true} title={'Upload file'}>
			<UploadModalStyled>
				<VStack mb={-6} align={'stretch'}>
					<DropZone />
					<FormActions
						submitText={'Upload'}
						submitDisabled={isUploading}
						submitLoading={isUploading}
						cancelText={'Cancel'}
						cancelDisabled={isUploading}
						onCancel={() => {
							onClose();
						}}
					/>
				</VStack>
			</UploadModalStyled>
		</Modal>
	);
};
