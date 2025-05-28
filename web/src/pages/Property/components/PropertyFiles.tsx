import { Box, BoxProps, HStack, Heading, IconButton, Text, VStack } from '@chakra-ui/react';
import { DateTime } from 'luxon';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { DownloadIcon } from '../../../components/icons/DownloadIcon';
import { FileHouseIcon } from '../../../components/icons/FileTypes/FileHouseIcon';
import { FileImgIcon } from '../../../components/icons/FileTypes/FileImgIcon';
import { FilePdfIcon } from '../../../components/icons/FileTypes/FilePdfIcon';
import { FileVideoIcon } from '../../../components/icons/FileTypes/FileVideoIcon';
import { TrashIcon } from '../../../components/icons/TrashIcon';
import { DocumentTypes, PropertyDocument } from '../../../models/Property';
import { humanFileSize } from '../../../utils/FileSizeUtils';
import { GANT_CHART_FORMAT } from '../../Roadmap/GantChartDates';

import { ConfirmDialog } from '../../../components/ConfirmDialog';
import { useRemovePropertyDocument } from '../../../mutations/properties/useRemovePropertyDocument';

interface PropertyFileProps {
	showDelete: boolean;
	file: PropertyDocument;
}
export const PropertyFilesIcon = (fileType: DocumentTypes) => {
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

export const CardBase = (props: BoxProps) => (
	<Box
		maxWidth="100%"
		borderRadius="12px"
		border="1px solid"
		borderColor="black"
		boxShadow="md"
		p="24px"
		transition="all 0.2s linear"
		{...props}
	/>
);

export const PropertyFiles = ({ showDelete = true, file }: PropertyFileProps): JSX.Element => {
	const { propertyId } = useParams();
	const Icon = PropertyFilesIcon(file.type);
	const [dialogOpen, setDialogOpen] = useState(false);
	const { mutateAsync: removePropertyDocumentAsync } = useRemovePropertyDocument();

	//! The propertyId does is not showing up in the file for some reason.
	// This works for now, but I need to let Tommi know -> might be a bug in the backend.
	const propertyIdNumber = Number(propertyId);
	file.propertyId = propertyIdNumber;

	return (
		<CardBase>
			<HStack spacing={8}>
				<Icon />

				<VStack justify={'center'} align={'flex-start'} style={{ flex: 1 }}>
					<Heading m={0} mb={0} as={'h4'} size={'sm'}>
						{file.name}
					</Heading>
					<Text m={0}>File from file storage</Text>
				</VStack>
				<Text m={0}>{humanFileSize(file.bytes || 0)}</Text>
				<Text m={0}>{DateTime.fromMillis(file.created).toFormat(GANT_CHART_FORMAT)}</Text>
				<VStack justify={'center'} align={'center'}>
					<a href={file.url} target={'_blank'} rel={'noopener noreferrer'}>
						<IconButton
							aria-label={'Download'}
							colorScheme={'black'}
							size={'sm'} // does this work?
							icon={<DownloadIcon color={'white'} />}
						/>
					</a>
					<Text color={'black'} fontSize={'l'}>
						Download
					</Text>
				</VStack>
				{showDelete ? (
					<VStack justify={'center'} align={'center'}>
						<ConfirmDialog
							header={`Delete file: ${file.name}`}
							setIsOpen={setDialogOpen}
							callback={async (b) => {
								if (b) {
									await removePropertyDocumentAsync(file);
								}
								setDialogOpen(false);
							}}
							isOpen={dialogOpen}
						>
							<IconButton
								aria-label={'Delete'}
								colorScheme={'red'}
								size={'sm'} // does this work?
								icon={<TrashIcon color={'white'} />}
								onClick={() => {
									setDialogOpen(true);
								}}
							/>

							<Text color={'black'} fontSize={'l'}>
								Delete
							</Text>
						</ConfirmDialog>
					</VStack>
				) : null}
			</HStack>
		</CardBase>
	);
};
