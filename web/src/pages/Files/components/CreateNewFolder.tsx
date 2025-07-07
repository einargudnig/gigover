import {
	Box,
	Button,
	Flex,
	FormControl,
	FormErrorMessage,
	FormLabel,
	Input,
	Text
} from '@chakra-ui/react';
import { useCallback, useRef, useState } from 'react';
import { DropZone } from '../../../components/DropZone';
import { FormActions } from '../../../components/FormActions';
import { LoadingSpinner } from '../../../components/LoadingSpinner';
import { Modal } from '../../../components/Modal';
import { FolderIcon } from '../../../components/icons/FolderIcon';
import { useAddFolder } from '../../../queries/useAddFolder';

export const CreateNewFolderButton = ({
	projectId,
	folderId
}: {
	projectId: number;
	folderId?: number;
}) => {
	const inputRef = useRef<HTMLInputElement | null>(null);
	const [isOpen, setIsOpen] = useState(false);
	const { mutateAsync, isPending, isError, error } = useAddFolder();

	const addFolder = useCallback(() => {
		const folderName = inputRef.current?.value || '';

		if (!projectId) {
			return alert('Select a project first');
		}

		if (!folderName || folderName.length < 3) {
			return alert('Enter a name of 3 characters at least');
		}

		return mutateAsync({
			name: folderName,
			projectId: projectId,
			folderId
		}).then(() => {
			if (inputRef.current) {
				inputRef.current = null;
			}
			setIsOpen(false);
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [inputRef, projectId]);

	return (
		<>
			{isOpen && (
				<Modal
					title={'Add a folder'}
					open={isOpen}
					centerModal={true}
					onClose={() => setIsOpen(false)}
				>
					<FormControl id={'name'} isRequired isInvalid={isError}>
						<FormLabel>Folder name</FormLabel>
						<Input name="name" required={true} ref={inputRef} />
						{error && <FormErrorMessage>{error.message}</FormErrorMessage>}
					</FormControl>
					<FormActions
						submitText={'Create'}
						submitLoading={isPending}
						onSubmit={() => addFolder()}
						cancelText={'Close'}
						onCancel={() => setIsOpen(false)}
					/>
				</Modal>
			)}
			<Button
				leftIcon={<FolderIcon type="light" color="gray" />}
				onClick={() => {
					setIsOpen(true);
				}}
				colorScheme="gray"
				variant={'outline'}
			>
				Create folder
			</Button>
		</>
	);
};

export const CreateNewFolder = ({
	projectId,
	folderId
}: {
	projectId: number;
	folderId?: number;
}) => {
	return (
		<DropZone offerId={0} tenderId={0} projectId={projectId} folderId={folderId}>
			{({ isDragActive, isUploading }) => (
				<Box
					width="100%"
					bg="white"
					border={
						isDragActive
							? '1px solid var(--chakra-colors-green-400)'
							: '1px solid transparent'
					}
					borderRadius="12px"
					transition="all 0.2s linear"
					boxShadow="0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
					p={{ base: 2, md: 3, lg: 4 }}
					m={2}
				>
					<Flex justifyContent="center" alignItems="center" flexDirection="column">
						{isUploading ? (
							<LoadingSpinner />
						) : (
							<>
								<Text>
									Create a new folder or drop a folder here to start uploading
								</Text>
								<Box h={2} />
								<CreateNewFolderButton projectId={projectId} folderId={folderId} />
							</>
						)}
					</Flex>
				</Box>
			)}
		</DropZone>
	);
};
