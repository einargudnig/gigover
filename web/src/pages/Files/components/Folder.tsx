import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FolderIcon } from '../../../components/icons/FolderIcon';
import { colorGenerator } from '../../../hooks/colorGenerator';
import { CardBaseLink } from '../../../components/CardBase';
import { Heading, HStack, Text, VStack } from '@chakra-ui/react';
import { Project } from '../../../models/Project';
import { useFileService } from '../../../hooks/useFileService';
import { FileDocument, FolderResult } from '../../../services/FileSystemService';

interface FolderProps {
	project: Project;
	url?: string;
}

const FolderCard = styled(CardBaseLink)``;

export const Folder = ({ project, url }: FolderProps): JSX.Element => {
	const { fileService } = useFileService();
	const [folderResult, setFolderResult] = useState<FolderResult | null>(null);

	useEffect(() => {
		fileService.getProjectFilesDb(project.projectId, (snapshot) => {
			if (snapshot !== null && snapshot.exists()) {
				const files: FileDocument[] = [];
				// TODO convert to File model
				const map = Object.entries<FileDocument>(snapshot.val());
				console.log(snapshot.val());

				map.forEach(([, value]) => {
					files.push(value);
				});

				setFolderResult({
					folders: [],
					files: files
				});
			}
		});
	}, []);

	return (
		<FolderCard to={`/files/${project.projectId}/${url || ''}`}>
			<VStack align={'stretch'} spacing={4}>
				<FolderIcon
					size={38}
					color={colorGenerator(`${project.name}/${url}`, 150, 50).backgroundColor}
				/>
				<Heading as={'h4'} size={'sm'} fontWeight={'normal'}>
					{project.name}
				</Heading>
				<HStack justify={'space-between'}>
					<Text>{folderResult?.files.length || 0} files</Text>
				</HStack>
			</VStack>
		</FolderCard>
	);
};
