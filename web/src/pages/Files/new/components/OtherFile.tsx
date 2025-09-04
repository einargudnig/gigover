import { Box, HStack, Heading, IconButton, Text, VStack } from '@chakra-ui/react';
import { DateTime } from 'luxon';
import { useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { CardBaseLink } from '../../../../components/CardBase';
import { DownloadIcon } from '../../../../components/icons/DownloadIcon';
import { FileHouseIcon } from '../../../../components/icons/FileTypes/FileHouseIcon';
import { FileImgIcon } from '../../../../components/icons/FileTypes/FileImgIcon';
import { FilePdfIcon } from '../../../../components/icons/FileTypes/FilePdfIcon';
import { FileVideoIcon } from '../../../../components/icons/FileTypes/FileVideoIcon';
import { TrashIcon } from '../../../../components/icons/TrashIcon';
import { DocumentTypes, TenderDocument } from '../../../../models/Tender';
import { humanFileSize } from '../../../../utils/FileSizeUtils';
import { GANT_CHART_FORMAT } from '../../../Roadmap/GantChartDates';

import { ConfirmDialog } from '../../../../components/ConfirmDialog';
import { useDeleteTenderDocument } from '../../../../mutations/procurement/useDeleteTenderDocument';

// OtherFile means files for Tenders and Offers.
// I think I should just make a duplicate of the File.tsx so that I can more easily use it in two different places.
// Ultimately I want to make the file component more generic so that I can use it in more places.
interface OtherFileProps {
	showDelete: boolean;
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

export const OtherGigoverFile = ({ showDelete = false, file }: OtherFileProps): JSX.Element => {
	const Icon = OtherFileIconForType(file.type);
	const [dialogOpen, setDialogOpen] = useState(false); // for delete file on Tender
	const { mutateAsync: deleteTenderDocumentAsync } = useDeleteTenderDocument(); // for delete file on Tender

	return (
		<Box maxWidth="100%" borderRadius="12px" bg="white" padding="24px">
			<HStack spacing={8}>
				<Icon />

				<VStack justify={'center'} align={'flex-start'} style={{ flex: 1 }}>
					<Heading m={0} mb={0} as={'h4'} size={'sm'}>
						{file.name}
					</Heading>
					<Text m={0}>File from file storage</Text>
				</VStack>
				<Text m={0}>{humanFileSize(file.bytes || 0)}</Text>
				<Text m={0}>
					{DateTime.fromMillis(file.created || 0).toFormat(GANT_CHART_FORMAT)}
				</Text>
				<VStack justify={'center'} align={'center'} zIndex={88}>
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
									await deleteTenderDocumentAsync(file);
								}
								setDialogOpen(false);
							}}
							isOpen={dialogOpen}
							confirmButtonText="Delete"
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
		</Box>
	);
};
