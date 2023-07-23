import React from 'react';
import styled from 'styled-components';
import { CardBaseLink } from '../../../../components/CardBase';
import { FileVideoIcon } from '../../../../components/icons/FileTypes/FileVideoIcon';
import { FileImgIcon } from '../../../../components/icons/FileTypes/FileImgIcon';
import { FileHouseIcon } from '../../../../components/icons/FileTypes/FileHouseIcon';
import { FilePdfIcon } from '../../../../components/icons/FileTypes/FilePdfIcon';
import { Heading, HStack, Text, VStack } from '@chakra-ui/react';
import { humanFileSize } from '../../../../utils/FileSizeUtils';
import { DocumentTypes } from '../../../../models/ProjectImage';
import { TenderDocument } from '../../../../models/Tender';
import moment from 'moment';
import { GANT_CHART_FORMAT } from '../../../Roadmap/GantChartDates';

// OtherFile means files for Tenders and Offers.
// I think I should just make a duplicate of the File.tsx so that I can more easily use it in two different places.

interface OtherFileProps {
	file: TenderDocument;
}
export const OtherFileIconForType = (fileType: DocumentTypes) => {
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

// I need to figure out how I differentiate between tenders and offers
export const GetFileLink = (file: TenderDocument) => {
	const href = `/files/${file.projectId}/${file.imageId}`;

	return href;
};

export const OtherGigoverFile = ({ file }: OtherFileProps): JSX.Element => {
	const Icon = OtherFileIconForType(file.type);
	const href = GetFileLink(file);

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
