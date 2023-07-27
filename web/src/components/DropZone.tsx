import React, { useCallback, useState } from 'react';
import styled, { css } from 'styled-components';
import { FilterIcon } from './icons/FilterIcon';
import { Progress, Text } from '@chakra-ui/react';
import { FileUploadType } from '../models/FileUploadType';
import { useFileService } from '../hooks/useFileService';
import { useDropzone } from 'react-dropzone';
import { useAddDocument } from '../mutations/useAddDocument';
import { devError } from '../utils/ConsoleUtils';
import { ProjectImage } from '../models/ProjectImage';
import { useAddFolder } from '../queries/useAddFolder';

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
	offerId?: number;
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
	uploadType = FileUploadType.Project,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	offerId = 0,
	projectId,
	folderId,
	externalId,
	callback,
	children
}: DropZoneProps): JSX.Element => {
	const { fileService } = useFileService();
	const folder = useAddFolder();
	const mutate = useAddDocument();

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
							(offerId = 0),
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
