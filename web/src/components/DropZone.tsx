import React, { useCallback, useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import { FilterIcon } from './icons/FilterIcon';
import { Progress, Text } from '@chakra-ui/react';
import { FileUploadType } from '../models/FileUploadType';
import { useFileService } from '../hooks/useFileService';
import { useDropzone } from 'react-dropzone';

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
			background: greenyellow;
		`};
`;

export const DropZone = (): JSX.Element => {
	const { fileService } = useFileService();
	const onDrop = useCallback(async (acceptedFiles: File[]) => {
		// Do something with the files
		if (acceptedFiles.length > 0) {
			const file = acceptedFiles[0];
			const parts = file.name.split('.');

			try {
				setIsUploading(true);
				const response = await fileService.uploadFile(
					file,
					1052,
					FileUploadType.Comment,
					'.' + parts[1],
					(status: number) => {
						// eslint-disable-next-line no-console
						console.log('File upload :: Status update ', status);
						setFileUploadProgress(status);
					}
				);

				if (response.downloadUrl) {
					// eslint-disable-next-line no-console
					console.log('DOWNLOADURL', response.downloadUrl);
				}
			} finally {
				setIsUploading(false);
			}
		}
	}, []);

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		multiple: true,
		onDrop
	});

	const [fileUploadProgress, setFileUploadProgress] = useState(0);
	const [isUploading, setIsUploading] = useState(false);

	useEffect(() => {
		console.log('isDragActive', isDragActive);
	}, [isDragActive]);

	return (
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
