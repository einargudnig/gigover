import React, { useState, useCallback } from 'react';
import { Text, VStack, Progress } from '@chakra-ui/react';
import styled, { css } from 'styled-components';
import { Modal } from '../../../../components/Modal';
import { FormActions } from '../../../../components/FormActions';
import { TenderDocument } from '../../../../models/TenderDocument';
import { useAddTenderDocument } from '../../../../mutations/useAddTenderDocument';
import { devError } from '../../../../utils/ConsoleUtils';
import { FileUploadType } from '../../../../models/FileUploadType';
import { FilterIcon } from '../../../../components/icons/FilterIcon';
import { useDropzone } from 'react-dropzone';
import { useFileService } from '../../../../hooks/useFileService';

interface UploadModalProps {
	onClose: () => void;
	onComplete: (status: boolean) => void;
	offerId: number;
}

const UploadModalStyled = styled.div`
	@media screen and (max-width: 500px) {
		width: 500px;
	}
`;

// What am doing with this?
// I need the projectId and folderId to be able to upload the file?
// maybe I will need to prop drill that to the DropZone component

export const UploadCertifications = ({ onClose, offerId }: UploadModalProps): JSX.Element => {
	return (
		<Modal open={true} onClose={onClose} centerModal={true} title={'Upload file for offer'}>
			<UploadModalStyled>
				<VStack mb={-6} align={'stretch'}>
					<DropZone offerId={offerId} />
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

// I need to make a new dropZone component that will be used for the upload certifications
// I don't want to brake the other one. Their use is similar but not the same.

const DropZoneContainer = styled.div<{
	isDraggingOver: boolean;
}>`
	padding: ${(props) => props.theme.padding(6, 0)};
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	flex: 1;
	background: #f6f6f6;
	border-radius: ${(props) => props.theme.borderRadius};
	cursor: pointer;

	${(props) =>
		props.isDraggingOver &&
		css`
			background: ${props.theme.colors.green};
		`};
`;

interface DropZoneProps {
	offerId: number;
	uploadType?: FileUploadType;
	externalId?: number;
	callback?: (tenderDocument?: TenderDocument, file?: File) => void;

	children?(props: {
		isDragActive: boolean;
		isUploading: boolean;
		open: () => void;
	}): React.ReactNode;
}

const DropZone = ({
	uploadType = FileUploadType.Project,
	offerId,
	externalId,
	callback,
	children
}: DropZoneProps): JSX.Element => {
	const { fileService } = useFileService();
	// const mutate = useAddTenderDocument();
	const { mutateAsync } = useAddTenderDocument();

	const onDrop = useCallback(
		async (acceptedFiles: (File & { path: string })[]) => {
			// Do something with the files
			console.log(isUploading, 'ISUPLOADING');
			if (acceptedFiles.length > 0) {
				let createdFolder: number | undefined;
				const fPath = acceptedFiles[0]?.path ?? '';

				if (fPath.includes('/')) {
					setIsUploading(true);
				}

				acceptedFiles.forEach(async (file) => {
					try {
						setIsUploading(true);
						const response = await fileService.uploadFile(
							file,
							offerId,
							createdFolder ?? 0,
							uploadType!,
							(status: number) => {
								setFileUploadProgress(status);
							},
							externalId
						);

						let uploadedFile: { tenderDocument: TenderDocument } | undefined;

						try {
							uploadedFile = await mutateAsync(response);
						} catch (e) {
							devError('FileUpload', e);
						} finally {
							if (callback) {
								callback(uploadedFile?.tenderDocument, file);
							}
						}
					} finally {
						setIsUploading(false);
					}
				}, []);
			}
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[fileService, uploadType, offerId, externalId]
	);

	const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
		multiple: true,
		// @ts-ignore
		onDrop
	});

	const [fileUploadProgress, setFileUploadProgress] = useState(0);
	const [isUploading, setIsUploading] = useState(false);

	return children ? (
		<div
			{...getRootProps({
				onClick: (event) => event.stopPropagation()
			})}
			style={{ width: '100%' }}
		>
			<input {...getInputProps()} />
			{isUploading ? (
				<div style={{ width: '100%', textAlign: 'center', marginBottom: '6px' }}>
					<Text>Uploading ({fileUploadProgress}%)</Text>
					<Progress colorScheme="green" size="sm" value={fileUploadProgress || 0} />
				</div>
			) : null}
			{children({ isDragActive, isUploading, open })}
		</div>
	) : (
		<DropZoneContainer {...getRootProps()} isDraggingOver={isDragActive}>
			<input {...getInputProps()} />
			<FilterIcon size={64} color={'#838894'} />
			{isUploading ? (
				<div style={{ width: '100%', textAlign: 'center' }}>
					<Text>Uploading ({fileUploadProgress}%)</Text>
					<Progress colorScheme="green" size="sm" value={fileUploadProgress || 0} />
				</div>
			) : (
				<div>
					<Text>
						{isDragActive
							? 'Drop files here'
							: 'Drag and drop files here or click to select a file'}
					</Text>
				</div>
			)}
		</DropZoneContainer>
	);
};
