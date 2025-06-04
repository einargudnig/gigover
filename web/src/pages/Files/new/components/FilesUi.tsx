import { HStack, Heading, VStack, useDisclosure } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CardBase } from '../../../../components/CardBase';
import { DropZone } from '../../../../components/DropZone';
import { LoadingSpinner } from '../../../../components/LoadingSpinner';
import { EmptyState } from '../../../../components/empty/EmptyState';
import { EditPhotoModal } from '../../../../components/modals/EditPhotoModal';
import { ProjectImage } from '../../../../models/ProjectImage';
import { GigoverFile } from '../../components/File';

export const FilesUi = ({ files, title, projectId }) => {
	const params = useParams<{ projectId: string; folderId?: string; fileId?: string }>();
	const [selectedFile, setSelectedFile] = useState<ProjectImage | null>(null);
	const [selectedIndex, setSelectedIndex] = useState<number>(-1);
	const navigate = useNavigate();

	const { isOpen, onOpen, onClose: disclosureOnClose } = useDisclosure();

	const folderId = params.folderId || null;

	useEffect(() => {
		const currentFileIdStr = params.fileId;
		if (currentFileIdStr && files && files.length > 0) {
			const fileIdToFind = parseInt(currentFileIdStr, 10);
			const index = files.findIndex((d: ProjectImage) => d.imageId === fileIdToFind);
			const file = files[index];

			if (file) {
				setSelectedFile(file);
				setSelectedIndex(index);
				if (!isOpen) {
					onOpen();
				}
			} else {
				// fileId in URL but not found (e.g., deleted or invalid)
				setSelectedFile(null);
				setSelectedIndex(-1);
				if (isOpen) {
					disclosureOnClose();
				}
				// Navigate away from the invalid fileId URL
				const basePath = `/files/${projectId}${folderId ? '/folder/' + folderId : ''}`;
				// Only navigate if params.fileId was actually set, to avoid navigating on initial load without a fileId
				if (params.fileId) {
					navigate(basePath, { replace: true });
				}
			}
		} else {
			// No fileId in URL, or no files array
			setSelectedFile(null);
			setSelectedIndex(-1);
			if (isOpen) {
				disclosureOnClose();
			}
		}
	}, [
		files,
		params.fileId,
		isOpen,
		onOpen,
		disclosureOnClose,
		navigate,
		projectId,
		folderId,
		setSelectedFile,
		setSelectedIndex
	]);

	const handleModalClose = () => {
		disclosureOnClose();
		const basePath = `/files/${projectId}${folderId ? '/folder/' + folderId : ''}`;
		// Only navigate if we are currently on a specific file path
		if (params.fileId) {
			navigate(basePath, { replace: true });
		}
	};

	const moveFile = (direction: 'left' | 'right') => {
		let targetFile: ProjectImage | undefined;
		const currentFolderId = params.folderId || null;

		if (selectedIndex === -1 && files && files.length > 0) {
			// If no file is selected, but we try to move, default to selecting first/last
			if (direction === 'left') {
				targetFile = files[files.length - 1];
			} else {
				targetFile = files[0];
			}
		} else if (direction === 'left' && selectedIndex > 0) {
			targetFile = files[selectedIndex - 1];
		} else if (
			direction === 'right' &&
			selectedIndex < files.length - 1 &&
			selectedIndex !== -1
		) {
			targetFile = files[selectedIndex + 1];
		}

		if (targetFile) {
			navigate(
				`/files/${projectId}${currentFolderId ? '/folder/' + currentFolderId : ''}/${
					targetFile.imageId
				}`,
				{ replace: true }
			);
		}
	};
	/*
		useKeyPress('ArrowLeft', () => moveFile('left'));
		useKeyPress('ArrowRight', () => moveFile('right'));
	*/

	return (
		<>
			{selectedFile && isOpen && (
				<EditPhotoModal
					projectId={projectId}
					file={selectedFile}
					onClose={handleModalClose}
					moveFile={moveFile}
					isOpen={isOpen}
				/>
			)}

			<HStack spacing={4}>
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
					<VStack style={{ width: '100%' }} align={'stretch'} spacing={4} mt={4}>
						{files
							.sort((a, b) => (b.created && a.created ? b.created - a.created : -1))
							.map((p, pIndex) => (
								<GigoverFile key={pIndex} file={p} />
							))}
					</VStack>
				) : (
					<DropZone
						offerId={0}
						tenderId={0}
						projectId={projectId}
						folderId={folderId ? parseInt(folderId) : undefined}
					>
						{({ isDragActive, isUploading }) => (
							<CardBase
								style={{
									width: '100%',
									border: isDragActive
										? '1px solid var(--chakra-colors-green-400)'
										: '1px solid transparent'
								}}
							>
								{isUploading ? (
									<LoadingSpinner />
								) : (
									<EmptyState
										title={'No files yet'}
										text={'Drop files here to start uploading!'}
									/>
								)}
							</CardBase>
						)}
					</DropZone>
				)}
			</HStack>
		</>
	);
};
