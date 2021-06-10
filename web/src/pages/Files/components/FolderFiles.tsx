import React from 'react';
import { useFolderDocuments } from '../../../queries/useFolderDocuments';
import { Project } from '../../../models/Project';
import { Heading, HStack, VStack } from '@chakra-ui/react';
import { FilePdfIcon } from '../../../components/icons/FileTypes/FilePdfIcon';
import { Center } from '../../../components/Center';
import { LoadingSpinner } from '../../../components/LoadingSpinner';
import { File, GigoverFile } from './File';
import { EmptyState } from '../../../components/empty/EmptyState';

interface FolderFilesProps {
	project: Project;
	folderId: number;
}

export const FolderFiles = ({ project, folderId }: FolderFilesProps): JSX.Element => {
	const { data, isLoading } = useFolderDocuments(folderId);

	return (
		<>
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
