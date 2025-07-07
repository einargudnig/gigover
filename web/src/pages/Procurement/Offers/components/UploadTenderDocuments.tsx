import { Box, Progress, Text, VStack, useToast } from '@chakra-ui/react';
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FormActions } from '../../../../components/FormActions';
import { Modal } from '../../../../components/Modal';
import { FilterIcon } from '../../../../components/icons/FilterIcon';
import { useFileService } from '../../../../hooks/useFileService';
import { FileUploadType } from '../../../../models/FileUploadType';
import { TenderDocument } from '../../../../models/TenderDocument';
// import { useAddTenderDocument } from '../../../../mutations/procurement/useAddTenderDocument';
import { useAddTenderDocumentByTenderOwner } from '../../../../mutations/procurement/useAddTenderDocumentByTenderOwner';
import { DocumentInput } from '../../../../mutations/useAddDocument';
import { devError } from '../../../../utils/ConsoleUtils';
interface UploadModalProps {
	onClose: () => void;
	onComplete: (status: boolean) => void;
	tenderId: number;
}

export const UploadTenderDocuments = ({ onClose, tenderId }: UploadModalProps): JSX.Element => {
	return (
		<Modal open={true} onClose={onClose} centerModal={true} title={'Upload file for offer'}>
			<Box w={{ base: '100%', sm: '500px' }}>
				<Text marginBottom={4}>
					You can upload any file you file necessary, this file will be linked to this
					offer.
				</Text>
				<VStack mb={-6} align={'stretch'}>
					<DropZone
						propertyId={0}
						offerId={0}
						tenderId={tenderId}
						projectId={0}
						uploadType={FileUploadType.Tender}
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
			</Box>
		</Modal>
	);
};

// I need to make a new dropZone component that will be used for the upload certifications
// I don't want to brake the other one. Their use is similar but not the same.

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
	tenderId,
	projectId = 0,
	uploadType = FileUploadType.Project,
	externalId,
	callback,
	children
}: DropZoneProps): JSX.Element => {
	const { fileService } = useFileService();
	// const { mutateAsync } = useAddTenderDocument();
	const { mutateAsync } = useAddTenderDocumentByTenderOwner();
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
						console.log('tenderId, before uploadFile', tenderId);
						const response: DocumentInput = await fileService.uploadFile(
							file,
							propertyId,
							offerId,
							tenderId,
							projectId,
							createdFolder ?? 0,
							uploadType!,
							(status: number) => {
								setFileUploadProgress(status);
							},
							externalId
						);
						console.log('response in DropZone', response);
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
		<Box
			{...getRootProps()}
			py={6}
			px={0}
			display="flex"
			justifyContent="center"
			alignItems="center"
			flexDirection="column"
			flex={1}
			bg={isDragActive ? 'green.500' : '#f6f6f6'}
			borderRadius="md"
			cursor="pointer"
		>
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
		</Box>
	);
};
