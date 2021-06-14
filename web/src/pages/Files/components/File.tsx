import React from 'react';
import styled from 'styled-components';
import { ProjectFile, FileType } from '../../../models/ProjectFile';
import { CardBaseLink } from '../../../components/CardBase';
import { FileTextIcon } from '../../../components/icons/FileTypes/FileTextIcon';
import { FileStarIcon } from '../../../components/icons/FileTypes/FileStarIcon';
import { FileVideoIcon } from '../../../components/icons/FileTypes/FileVideoIcon';
import { FileImgIcon } from '../../../components/icons/FileTypes/FileImgIcon';
import { FileHouseIcon } from '../../../components/icons/FileTypes/FileHouseIcon';
import { FilePdfIcon } from '../../../components/icons/FileTypes/FilePdfIcon';
import { Text, Heading, VStack, HStack } from '@chakra-ui/react';
import moment from 'moment';
import { GANT_CHART_FORMAT } from '../../Roadmap/GantChartDates';
import { humanFileSize } from '../../../utils/FileSizeUtils';
import { DocumentTypes, ProjectImage } from '../../../models/ProjectImage';

interface FileProps {
	file: ProjectFile;
}

interface GigoverFileProps {
	file: ProjectImage;
}

export const GigoverFileIconForType = (fileType: DocumentTypes) => {
	switch (fileType) {
		case 'IMAGE':
		case 0:
			return FileImgIcon;
		case 'VIDEO':
		case 1:
			return FileVideoIcon;
		case 'DOCUMENT':
		case 2:
			return FilePdfIcon;
		default:
			return FileHouseIcon;
	}
};

const FileStyled = styled(CardBaseLink)``;

// @deprecated
export const FileIconForType = (fileType: FileType) => {
	switch (fileType) {
		case 'txt':
			return FileTextIcon;
		case 'other':
			return FileStarIcon;
		case 'video':
			return FileVideoIcon;
		case 'picture':
			return FileImgIcon;
		case 'drawing':
			return FileHouseIcon;
		case 'pdf':
			return FilePdfIcon;
		default:
		case 'document':
			return FileTextIcon;
	}
};

// @deprecated
export const File = ({ file }: FileProps): JSX.Element => {
	const Icon = FileIconForType(file.type);

	return (
		<FileStyled to={`/files/${file.projectId}/file/${file.imageId}`}>
			<HStack spacing={8}>
				<Icon />
				<VStack justify={'center'} align={'flex-start'} style={{ flex: 1 }}>
					<Heading m={0} mb={0} as={'h4'} size={'sm'}>
						{file.name}
					</Heading>
					<Text m={0}>Project file</Text>
				</VStack>
				<Text m={0}>{humanFileSize(file.bytes)}</Text>
				<Text m={0}>{moment(file.created).format(GANT_CHART_FORMAT)}</Text>
			</HStack>
		</FileStyled>
	);
};

export const GigoverFile = ({ file }: GigoverFileProps): JSX.Element => {
	const Icon = GigoverFileIconForType(file.type);
	let href = `/files/${file.projectId}/file/${file.imageId}`;

	if (file.folderId) {
		href = `/files/${file.projectId}/file/${file.folderId}/${file.imageId}`;
	}

	return (
		<FileStyled to={href}>
			<HStack spacing={8}>
				<Icon />
				<VStack justify={'center'} align={'flex-start'} style={{ flex: 1 }}>
					<Heading m={0} mb={0} as={'h4'} size={'sm'}>
						{file.name}
					</Heading>
					<Text m={0}>Project file</Text>
				</VStack>
				<Text m={0}>{humanFileSize(file.bytes || 0)}</Text>
				<Text m={0}>{moment(file.created).format(GANT_CHART_FORMAT)}</Text>
			</HStack>
		</FileStyled>
	);
};
