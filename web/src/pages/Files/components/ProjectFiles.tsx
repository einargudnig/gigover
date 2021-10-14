import React, { useEffect, useState } from 'react';
import { Project } from '../../../models/Project';
import { Heading, HStack, VStack } from '@chakra-ui/react';
import { FilePdfIcon } from '../../../components/icons/FileTypes/FilePdfIcon';
import { GigoverFile } from './File';
import { EmptyState } from '../../../components/empty/EmptyState';
import { useNavigate, useParams } from 'react-router-dom';
import { ProjectImage } from '../../../models/ProjectImage';
import { EditPhotoModal } from '../../../components/modals/EditPhotoModal';

interface ProjectFilesProps {
	project: Project;
}

export const ProjectFiles = ({ project }: ProjectFilesProps): JSX.Element => {
	const params = useParams();
	const navigate = useNavigate();
	const [selectedFile, setSelectedFile] = useState<ProjectImage | null>(null);

	useEffect(() => {
		if (project.images.length > 0 && params.fileId) {
			const file = project.images.find((d) => d.imageId === parseInt(params.fileId || '-1'));

			if (file) {
				setSelectedFile(file);
				return;
			}
		}

		setSelectedFile(null);
	}, [project.images, params.fileId]);

	return (
		<>
			{selectedFile && (
				<EditPhotoModal
					projectId={project.projectId}
					file={selectedFile}
					onClose={() => navigate(-1)}
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
