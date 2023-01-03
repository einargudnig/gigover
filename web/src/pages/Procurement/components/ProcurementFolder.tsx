import React from 'react';
import styled from 'styled-components';
import { FolderIcon } from '../../../components/icons/FolderIcon';
import { colorGenerator } from '../../../hooks/colorGenerator';
import { CardBaseLink } from '../../../components/CardBase';
import { Heading, HStack, Text, VStack } from '@chakra-ui/react';

// import { LoadingSpinner } from '../../../components/LoadingSpinner';
import { Tender } from '../../../models/Tender';
import { Theme } from '../../../Theme';

interface ProcurementProps {
	projectId?: number;
	name?: string;
	description?: string;
	finishDate?: number;
	owner?: string;
	status?: string;
	tenders?: Tender[];
}

const ProcurementFolderStyled = styled(CardBaseLink)`
	width: 100%;
	max-width: 100%;
	outline: 1px solid ${Theme.colors.border};
`;

export const ProcurementFolder = ({
	projectId,
	name,
	description,
	tenders
}: ProcurementProps): JSX.Element => {
	return (
		<ProcurementFolderStyled to={`${projectId}`}>
			<VStack align={'stretch'} spacing={4}>
				<HStack justify={'space-between'} align={'center'}>
					<FolderIcon
						size={38}
						color={colorGenerator(`${name}/}`, 150, 50).backgroundColor}
					/>
				</HStack>
				<Heading as={'h4'} size={'sm'} fontWeight={'normal'}>
					{name}
				</Heading>
				<HStack justify={'space-between'}>
					<Text>{description}</Text>
				</HStack>
				<HStack justify={'space-between'}>
					<Text>{tenders?.length} tenders</Text>
				</HStack>
			</VStack>
		</ProcurementFolderStyled>
	);
};

// Folder creation and deletion inside folders.
// I don't think we'll need to go down one more level.
// It would be nice, but I think it's just too much code to maintain for now!
// See how it is on Folder.tsx for reference.
// export const ProcurementProjectFolderComponent = () => { }
