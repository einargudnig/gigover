import React, { useEffect, useState } from 'react';
import { Project } from '../../../models/Project';
import { Heading, HStack, VStack } from '@chakra-ui/react';
import { FilePdfIcon } from '../../../components/icons/FileTypes/FilePdfIcon';
import { GigoverFile } from './File';
import { EmptyState } from '../../../components/empty/EmptyState';
import { useNavigate, useParams } from 'react-router-dom';
import { ProjectImage } from '../../../models/ProjectImage';
import { EditPhotoModal } from '../../../components/modals/EditPhotoModal';
import useKeyPress from '../../../hooks/useArrowKey';

interface ProjectFilesProps {
	project: Project;
}

export const ProjectFiles = ({ project }: ProjectFilesProps): JSX.Element => {
	const params = useParams();
	const navigate = useNavigate();
	const [selectedFile, setSelectedFile] = useState<ProjectImage | null>(null);
	const [selectedIndex, setSelectedIndex] = useState<number>(-1);

	useEffect(() => {
		if (project.images.length > 0 && params.fileId) {
			const index = project.images.findIndex(
				(d) => d.imageId === parseInt(params.fileId || '-1')
			);

			const file = project.images[index];
			setSelectedIndex(index);
			if (file) {
				setSelectedFile(file);
				return;
			}
		}

		setSelectedFile(null);
	}, [project.images, params.fileId]);

	const moveFile = (direction: 'left' | 'right') => {
		let file;
		if (direction === 'left') {
			file = project.images[selectedIndex - 1];
		} else {
			file = project.images[selectedIndex + 1];
		}
		if (file) {
			navigate('/files/' + project.projectId + '/file/' + file.imageId, { replace: true });
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
					{project.name} files
				</Heading>
			</HStack>
			<HStack
				justifyContent={'space-between'}
				align={'center'}
				mb={4}
				style={{ width: '100%' }}
			>
				{project.images.length > 0 ? (
					<VStack style={{ width: '100%' }} align={'stretch'} spacing={4}>
						{project.images
							.sort((a, b) => (b.created && a.created ? b.created - a.created : -1))
							.map((p, pIndex) => (
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
