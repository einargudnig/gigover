import React from 'react';
import styled from 'styled-components';
import { FolderIcon } from '../../../components/icons/FolderIcon';
import { colorGenerator } from '../../../hooks/colorGenerator';
import { CardBaseLink } from '../../../components/CardBase';
import { Heading, VStack, HStack, Text } from '@chakra-ui/react';
import { Project } from '../../../models/Project';

interface FolderProps {
	project: Project;
	url?: string;
}

const FolderCard = styled(CardBaseLink)``;

export const Folder = ({ project, url }: FolderProps): JSX.Element => {
	return (
		<FolderCard to={`${project.projectId}/${url || ''}`}>
			<VStack align={'stretch'} spacing={4}>
				<FolderIcon
					size={38}
					color={colorGenerator(`${project.name}/${url}`, 150, 50).backgroundColor}
				/>
				<Heading as={'h4'} size={'sm'} fontWeight={'normal'}>
					{project.name}
				</Heading>
				<HStack justify={'space-between'}>
					<Text>241 files</Text>
					<Text fontWeight={'bold'}>24 GB</Text>
				</HStack>
			</VStack>
		</FolderCard>
	);
};
