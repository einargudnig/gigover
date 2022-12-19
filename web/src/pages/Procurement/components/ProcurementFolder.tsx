import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import { FolderIcon } from '../../../components/icons/FolderIcon';
import { colorGenerator } from '../../../hooks/colorGenerator';
import { CardBaseLink } from '../../../components/CardBase';
import { Heading, HStack, Text, VStack } from '@chakra-ui/react';
import { humanFileSize } from '../../../utils/FileSizeUtils';
import { DropZone } from '../../../components/DropZone';
import { FileUploadType } from '../../../models/FileUploadType';

import { LoadingSpinner } from '../../../components/LoadingSpinner';
// import { Tender } from '../../../models/Tender';

// interface ProcurementFolderProps {
// 	projectId: number;
// 	name: string;
// 	description: string;
// 	finishDate: number;
// 	owner: string;
// 	status: string;
// 	tenders: Tender;
// }

const ProcurementFolderCard = styled(CardBaseLink)<{ isDragActive: boolean; selected?: boolean }>`
	${(props) =>
		props.isDragActive &&
		css`
			outline: 3px solid ${props.theme.colors.green};
		`};

	${(props) =>
		props.selected &&
		css`
			background: #000;
			color: #fff !important;
			box-shadow: none;
		`};
`;

// Folder that contains the Tenders
//! not delete
export const ProcurementFolder = ({
	projectId,
	name,
	description,
	owner,
	finishDate,
	status,
	tenders
}): JSX.Element => {
	console.log('TENDER', { tenders });
	console.log(name, 'NAME');

	return (
		<>
			{({ isDragActive, isUploading }) => (
				<ProcurementFolderCard
					// to={`/procurement/${projectId}/${url || ''}`}
					to={'/procurement'}
					isDragActive={isDragActive}
				>
					<VStack align={'stretch'} spacing={4}>
						<HStack justify={'space-between'} align={'center'}>
							<FolderIcon
								size={38}
								color={colorGenerator(`${tenders.name}`, 150, 50).backgroundColor}
								// color={colorGenerator(`${name}/${url}`, 150, 50).backgroundColor}
							/>
							{isUploading && <LoadingSpinner color={'black'} />}
						</HStack>
						<Heading as={'h4'} size={'sm'} fontWeight={'normal'}>
							{name}
						</Heading>
						<HStack justify={'space-between'}>
							{/* <Text>{tenders.fileCount || 0} files</Text> */}
						</HStack>
					</VStack>
				</ProcurementFolderCard>
			)}
		</>
	);
};

// Folder creation and deletion inside folders.
// I don't think we'll need to go down one more level.
// It would be nice, but I think it's just too much code to maintain for now!
// See how it is on Folder.tsx for reference.
// export const ProcurementProjectFolderComponent = () => { }
