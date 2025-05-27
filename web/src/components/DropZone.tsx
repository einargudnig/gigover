import { Box, Progress, Text, useTheme } from '@chakra-ui/react';
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useFileService } from '../hooks/useFileService';
import { FileUploadType } from '../models/FileUploadType';
import { ProjectImage } from '../models/ProjectImage';
import { useAddDocument } from '../mutations/useAddDocument';
import { useAddFolder } from '../queries/useAddFolder';
import { devError } from '../utils/ConsoleUtils';
import { FilterIcon } from './icons/FilterIcon';

interface DropZoneProps {
	propertyId?: number;
	offerId?: number;
	tenderId?: number;
	projectId: number;
	uploadType?: FileUploadType;
	folderId?: number;
	externalId?: number;
	callback?: (projectImage?: ProjectImage, file?: File) => void;

	children?(props: {
		isDragActive: boolean;
		isUploading: boolean;
		open: () => void;
	}): React.ReactNode;
}

export const DropZone = ({
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	propertyId = 0,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	offerId = 0,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	tenderId = 0,
	projectId,
	uploadType = FileUploadType.Project,
	folderId,
	externalId,
	callback,
	children
}: DropZoneProps): JSX.Element => {
	const { fileService } = useFileService();
	const folder = useAddFolder();
	const mutate = useAddDocument();
	const theme = useTheme();

	const createFolder = async (folderName: string) => {
		try {
			const folderResponse = await folder.mutateAsync({
				projectId: projectId,
				folderId: folderId,
				name: folderName
			});

			if (folderResponse.id) {
				return folderResponse.id;
			}

			throw Error('Could not create');
		} catch (e) {
			alert(
				'Could not create folder and upload items, please create folder manually and then upload items manually. This feature is supported by Google Chrome and not many other browsers.'
			);
			console.error('Folder creation', e);
			throw e;
		}
	};

	const onDrop = useCallback(
		async (acceptedFiles: (File & { path: string })[]) => {
			// Do something with the files
			console.log(isUploading, 'ISUPLOADING');
			if (acceptedFiles.length > 0) {
				let createdFolder: number | undefined;
				const fPath = acceptedFiles[0]?.path ?? '';

				if (fPath.includes('/')) {
					setIsUploading(true);
					const folderName = fPath.substr(1, fPath.indexOf('/', 1));
					createdFolder = await createFolder(folderName.replace('/', ''));
				}

				acceptedFiles.forEach(async (file) => {
					try {
						setIsUploading(true);
						const response = await fileService.uploadFile(
							file,
							propertyId,
							offerId,
							tenderId,
							projectId,
							createdFolder ?? folderId ?? 0,
							uploadType!,
							(status: number) => {
								setFileUploadProgress(status);
							},
							externalId
						);

						let uploadedFile: { projectImage: ProjectImage } | undefined;

						try {
							uploadedFile = await mutate.mutateAsync(response);
						} catch (e) {
							devError('FileUpload', e);
						} finally {
							if (callback) {
								callback(uploadedFile?.projectImage, file);
							}
						}
					} finally {
						setIsUploading(false);
					}
				}, []);
			}
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[fileService, uploadType, projectId, folderId, externalId]
	);

	const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
		multiple: true,
		// @ts-ignore
		onDrop
	});

	const [fileUploadProgress, setFileUploadProgress] = useState(0);
	const [isUploading, setIsUploading] = useState(false);

	return children ? (
		<Box
			{...getRootProps({
				onClick: (event) => event.stopPropagation()
			})}
			width="100%"
		>
			<input {...getInputProps()} />
			{isUploading ? (
				<Box width="100%" textAlign="center" marginBottom="6px">
					<Text>Uploading ({fileUploadProgress}%)</Text>
					<Progress colorScheme="green" size="sm" value={fileUploadProgress || 0} />
				</Box>
			) : null}
			{children({ isDragActive, isUploading, open })}
		</Box>
	) : (
		<Box
			{...getRootProps()}
			paddingY={6}
			paddingX={0}
			display="flex"
			justifyContent="center"
			alignItems="center"
			flexDirection="column"
			flex={1}
			background={isDragActive ? theme.colors.green[500] : '#f6f6f6'} // Use theme color
			borderRadius="md" // Or your theme's border radius
			cursor="pointer"
		>
			<input {...getInputProps()} />
			<FilterIcon size={64} color={'#838894'} />
			{isUploading ? (
				<Box width="100%" textAlign="center">
					<Text>Uploading ({fileUploadProgress}%)</Text>
					<Progress colorScheme="green" size="sm" value={fileUploadProgress || 0} />
				</Box>
			) : (
				<Box>
					<Text>
						{isDragActive
							? 'Drop files here'
							: 'Drag and drop files here or click to select a file'}
					</Text>
				</Box>
			)}
		</Box>
	);
};
