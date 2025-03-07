import React, { useState, useCallback } from 'react';
import { Text, VStack, Progress, useToast } from '@chakra-ui/react';
import styled, { css } from 'styled-components';
import { Modal } from '../../../../components/Modal';
import { FormActions } from '../../../../components/FormActions';
import { TenderDocument } from '../../../../models/TenderDocument';
import { useAddTenderDocument } from '../../../../mutations/procurement/useAddTenderDocument';
import { devError } from '../../../../utils/ConsoleUtils';
import { FileUploadType } from '../../../../models/FileUploadType';
import { FilterIcon } from '../../../../components/icons/FilterIcon';
import { useDropzone } from 'react-dropzone';
import { useFileService } from '../../../../hooks/useFileService';
import { DocumentInput } from '../../../../mutations/useAddDocument';

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

export const UploadCertifications = ({ onClose, offerId }: UploadModalProps): JSX.Element => {
	return (
		<Modal open={true} onClose={onClose} centerModal={true} title={'Upload file for offer'}>
			<UploadModalStyled>
				<Text marginBottom={4}>
					You can upload any file you file necessary, this file will be linked to this
					offer.
				</Text>
				<VStack mb={-6} align={'stretch'}>
					<DropZone
						propertyId={0}
						offerId={offerId}
						tenderId={0}
						projectId={0}
						uploadType={FileUploadType.Offer}
					/>
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
	propertyId: number;
	offerId: number;
	tenderId: number;
	projectId: number;
	uploadType?: FileUploadType;
	externalId?: number;
	callback?: (tenderDocument?: TenderDocument, file?: File) => void;

	children?(props: {
		isDragActive: boolean;
		isUploading: boolean;
		open: () => void;
	}): React.ReactNode;
}

export const DropZone = ({
	propertyId = 0,
	offerId = 0,
	tenderId = 0,
	projectId = 0,
	uploadType = FileUploadType.Project,
	externalId,
	callback,
	children
}: DropZoneProps): JSX.Element => {
	const { fileService } = useFileService();
	const { mutateAsync } = useAddTenderDocument();

	const toast = useToast();

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
						const response: DocumentInput = await fileService.uploadFile(
							file,
							propertyId,
							offerId,
							projectId,
							tenderId,
							createdFolder ?? 0,
							uploadType!,
							(status: number) => {
								setFileUploadProgress(status);
							},
							externalId
						);

						let uploadedFile: { tenderDocument: TenderDocument } | undefined;

						try {
							// @ts-ignore
							uploadedFile = await mutateAsync(response);
							toast({
								title: 'You have uplodaded a file!',
								description: 'View it in your file system',
								status: 'success',
								duration: 3000,
								isClosable: true
							});
						} catch (e) {
							devError('FileUpload', e);
							toast({
								title: 'Uploading failed',
								description: 'Uploading your file failed',
								status: 'error',
								duration: 3000,
								isClosable: true
							});
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
