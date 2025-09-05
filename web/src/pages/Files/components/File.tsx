import { HStack, Heading, Text, VStack } from '@chakra-ui/react';
import { DateTime } from 'luxon';
import { CardBaseLink } from '../../../components/CardBase';
import { FileHouseIcon } from '../../../components/icons/FileTypes/FileHouseIcon';
import { FileImgIcon } from '../../../components/icons/FileTypes/FileImgIcon';
import { FilePdfIcon } from '../../../components/icons/FileTypes/FilePdfIcon';
import { FileVideoIcon } from '../../../components/icons/FileTypes/FileVideoIcon';
import { DocumentTypes, ProjectImage } from '../../../models/ProjectImage';
import { humanFileSize } from '../../../utils/FileSizeUtils';
import { GANT_CHART_FORMAT } from '../../Roadmap/GantChartDates';

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

const GigoverThumbnail = (file: ProjectImage) => {
	return <img data-src={file.previewImage + '&mode=crop&w=60&h=60'} width={60} height={60} />;
};

const shouldShowThumbnail = (file: ProjectImage) => {
	// Don't show thumbnail for PSD files even if they have preview images
	if (file.name.toLowerCase().endsWith('.psd')) {
		return false;
	}

	return (file.type === 0 || file.type === 'IMAGE') && file.previewImage;
};

export const GetFileLink = (file: ProjectImage) => {
	let href = `/files/${file.projectId}/${file.imageId}`;

	if (file.folderId) {
		href = `/files/${file.projectId}/folder/${file.folderId}/${file.imageId}`;
	}

	return href;
};

export const GigoverFile = ({ file }: GigoverFileProps): JSX.Element => {
	const Icon = GigoverFileIconForType(file.type);
	const href = GetFileLink(file);

	return (
		<CardBaseLink to={href}>
			<HStack spacing={8}>
				{shouldShowThumbnail(file) ? GigoverThumbnail(file) : <Icon />}
				<VStack justify={'center'} align={'flex-start'} style={{ flex: 1 }}>
					<Heading m={0} mb={0} as={'h4'} size={'sm'}>
						{file.name}
					</Heading>
					<Text m={0}>Project file</Text>
				</VStack>
				<Text m={0}>{humanFileSize(file.bytes || 0)}</Text>
				<Text m={0}>
					{DateTime.fromMillis(file.created || 0).toFormat(GANT_CHART_FORMAT)}
				</Text>
			</HStack>
		</CardBaseLink>
	);
};
