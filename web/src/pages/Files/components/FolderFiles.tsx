import React, { useEffect, useState } from 'react';
import { useFolderDocuments } from '../../../queries/useFolderDocuments';
import { Project } from '../../../models/Project';
import { Heading, HStack, VStack } from '@chakra-ui/react';
import { FilePdfIcon } from '../../../components/icons/FileTypes/FilePdfIcon';
import { Center } from '../../../components/Center';
import { LoadingSpinner } from '../../../components/LoadingSpinner';
import { GigoverFile } from './File';
import { EmptyState } from '../../../components/empty/EmptyState';
import { useNavigate, useParams } from 'react-router-dom';
import { ProjectImage } from '../../../models/ProjectImage';
import { EditPhotoModal } from '../../../components/modals/EditPhotoModal';
import useKeyPress from '../../../hooks/useArrowKey';

interface FolderFilesProps {
	project: Project;
	folderId: number;
}

export const FolderFiles = ({ project, folderId }: FolderFilesProps): JSX.Element => {
	const params = useParams();
	const navigate = useNavigate();
	const [selectedFile, setSelectedFile] = useState<ProjectImage | null>(null);
	const [selectedIndex, setSelectedIndex] = useState<number>(-1);
	const { data, isLoading } = useFolderDocuments(folderId);
	useEffect(() => {
		if (data && data.length > 0 && params.fileId) {
			const index = data.findIndex(
				(d: ProjectImage) => d.imageId === parseInt(params.fileId || '-1')
			);
			const file = data[index];

			if (file) {
				setSelectedIndex(index);
				setSelectedFile(file);
				return;
			}
		}

		setSelectedFile(null);
		setSelectedIndex(-1);
	}, [data, params.fileId]);

	const moveFile = (direction: 'left' | 'right') => {
		let file;
		if (direction === 'left') {
			file = data[selectedIndex - 1];
		} else {
			file = data[selectedIndex + 1];
		}
		if (file) {
			navigate(
				'/files/' + project.projectId + '/file/' + file.folderId + '/' + file.imageId,
				{ replace: true }
			);
		}
	};

	useKeyPress('ArrowLeft', () => moveFile('left'));
	useKeyPress('ArrowRight', () => moveFile('right'));
	return (
		<>
			{selectedFile && (
				<EditPhotoModal
					projectId={project.projectId}
					file={selectedFile}
					onClose={() => navigate(-1)}
					moveFile={moveFile}
				/>
			)}
			<HStack spacing={4}>
				<FilePdfIcon />
				<Heading as={'h4'} size={'md'}>
					Folder files
				</Heading>
			</HStack>
			<HStack
				justifyContent={'space-between'}
				align={'center'}
				mb={4}
				style={{ width: '100%' }}
			>
				{isLoading ? (
					<Center>
						<LoadingSpinner />
					</Center>
				) : data.length > 0 ? (
					<VStack style={{ width: '100%' }} align={'stretch'} spacing={4}>
						{data
							.sort((a: ProjectImage, b: ProjectImage) =>
								b.created && a.created ? b.created - a.created : -1
							)
							.map((p: ProjectImage, pIndex: number) => (
								<GigoverFile key={pIndex} file={p} />
							))}
					</VStack>
				) : (
					<EmptyState
						title={'No files yet'}
						text={
							'No files have been uploaded yet, you can drop files on to projects or folders to upload them.'
						}
					/>
				)}
			</HStack>
		</>
	);
};
