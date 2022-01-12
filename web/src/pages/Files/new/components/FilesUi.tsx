import { EditPhotoModal } from '../../../../components/modals/EditPhotoModal';
import React, { useEffect, useState } from 'react';
import { Heading, HStack, VStack } from '@chakra-ui/react';
import { FilePdfIcon } from '../../../../components/icons/FileTypes/FilePdfIcon';
import { GigoverFile } from '../../components/File';
import { EmptyState } from '../../../../components/empty/EmptyState';
import useKeyPress from '../../../../hooks/useArrowKey';
import { useNavigate, useParams } from 'react-router-dom';
import { ProjectImage } from '../../../../models/ProjectImage';

export const FilesUi = ({ files, title, projectId }) => {
	const params = useParams();
	const [selectedFile, setSelectedFile] = useState<ProjectImage | null>(null);
	const [selectedIndex, setSelectedIndex] = useState<number>(-1);
	const navigate = useNavigate();

	const fileId = params.fileId || null;
	const folderId = params.folderId || null;

	useEffect(() => {
		if (files && files.length > 0 && params.fileId) {
			const index = files.findIndex(
				(d: ProjectImage) => d.imageId === parseInt(params.fileId || '-1')
			);
			const file = files[index];

			if (file) {
				setSelectedIndex(index);
				setSelectedFile(file);
				return;
			}
		}
		setSelectedFile(null);
		setSelectedIndex(-1);
	}, [files, params.fileId]);

	const moveFile = (direction: 'left' | 'right') => {
		let file;
		if (direction === 'left') {
			file = files[selectedIndex - 1];
		} else {
			file = files[selectedIndex + 1];
		}
		if (file) {
			if (folderId) {
			}
			navigate(
				'/files/' +
					projectId +
					(folderId ? '/folder/' + folderId : '') +
					'/' +
					file.imageId,
				{ replace: true }
			);
		}
	};

/*	useKeyPress('ArrowLeft', () => moveFile('left'));
	useKeyPress('ArrowRight', () => moveFile('right'));*/

	return (
		<>
			{selectedFile && (
				<EditPhotoModal
					projectId={projectId}
					file={selectedFile}
					onClose={() => navigate(-1)}
					moveFile={moveFile}
				/>
			)}

			<HStack spacing={4}>
				<FilePdfIcon />
				<Heading as={'h4'} size={'md'}>
					{title}
				</Heading>
			</HStack>
			<HStack
				justifyContent={'space-between'}
				align={'center'}
				mb={4}
				style={{ width: '100%' }}
			>
				{files.length > 0 ? (
					<VStack style={{ width: '100%' }} align={'stretch'} spacing={4}>
						{files
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
