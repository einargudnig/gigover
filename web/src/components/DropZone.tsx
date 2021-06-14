import React, { useCallback, useState } from 'react';
import styled, { css } from 'styled-components';
import { FilterIcon } from './icons/FilterIcon';
import { Progress, Text } from '@chakra-ui/react';
import { FileUploadType } from '../models/FileUploadType';
import { useFileService } from '../hooks/useFileService';
import { useDropzone } from 'react-dropzone';
import { useQueryClient } from 'react-query';
import { ApiService } from '../services/ApiService';
import { useAddDocument } from '../mutations/useAddDocument';

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
	uploadType?: FileUploadType;
	projectId?: number;
	folderId?: number;
	externalId?: number;

	children?(props: { isDragActive: boolean; isUploading: boolean }): React.ReactNode;
}

export const DropZone = ({
	uploadType = FileUploadType.Project,
	projectId,
	folderId,
	externalId,
	children
}: DropZoneProps): JSX.Element => {
	const { fileService } = useFileService();
	const mutate = useAddDocument();
	// TODO Implement setSelectedProject
	const [selectedProject] = useState<number>(projectId || 0);

	const onDrop = useCallback(
		(acceptedFiles: File[]) => {
			// Do something with the files
			if (acceptedFiles.length > 0) {
				acceptedFiles.forEach(async (file) => {
					try {
						setIsUploading(true);
						const response = await fileService.uploadFile(
							file,
							selectedProject,
							folderId || 0,
							uploadType!,
							(status: number) => {
								setFileUploadProgress(status);
							},
							externalId
						);

						mutate.mutateAsync(response).then(() => {
							console.log('Upload complet');
						});
					} finally {
						setIsUploading(false);
					}
				}, []);
			}
		},
		[fileService, uploadType, selectedProject, folderId, externalId]
	);

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		multiple: true,
		onDrop
	});

	const [fileUploadProgress, setFileUploadProgress] = useState(0);
	const [isUploading, setIsUploading] = useState(false);

	return children ? (
		<div
			{...getRootProps({
				onClick: (event) => event.stopPropagation()
			})}
		>
			<input {...getInputProps()} />
			{children({ isDragActive, isUploading })}
		</div>
	) : (
		<DropZoneContainer isDraggingOver={isDragActive} {...getRootProps()}>
			<input {...getInputProps()} />
			<FilterIcon size={64} color={'#838894'} />
			{isUploading ? (
				<div style={{ width: '100%', textAlign: 'center' }}>
					<Text>Uploading ({fileUploadProgress}%)</Text>
					<Progress colorScheme="green" size="sm" value={fileUploadProgress || 0} />
				</div>
			) : (
				<Text>
					{isDragActive
						? 'Drop files here'
						: 'Drag and drop files here or click to select a file'}
				</Text>
			)}
		</DropZoneContainer>
	);
};
