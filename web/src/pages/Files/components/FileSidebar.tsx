import {
	HStack,
	IconButton,
	Text,
	VStack,
	Divider,
	Heading,
	Image,
	Spacer
} from '@chakra-ui/react';
import React from 'react';
import { ProjectFile } from '../../../models/ProjectFile';
import { FileIconForType } from './File';
import { CrossIcon } from '../../../components/icons/CrossIcon';
import { humanFileSize } from '../../../utils/FileSizeUtils';
import { DownloadIcon } from '../../../components/icons/DownloadIcon';
import { TrashIcon } from '../../../components/icons/TrashIcon';

interface FileSidebarProps {
	onClose: () => void;
	file: ProjectFile;
}

export const FileSidebar = ({ onClose, file }: FileSidebarProps): JSX.Element => {
	const Icon = FileIconForType(file.type);

	const onChangeFileName = (event: React.FocusEvent<HTMLSpanElement>) => {
		console.log(event.target! as Element);
	};

	return (
		<VStack align={'stretch'} style={{ flex: 1, height: '100%', width: '100%' }}>
			<HStack justify={'space-between'} align={'center'} spacing={4}>
				<div>
					<Icon />
				</div>
				<Text isTruncated={true}>
					<span
						contentEditable={true}
						suppressContentEditableWarning
						onBlur={onChangeFileName}
					>
						{file.name}
					</span>
				</Text>
				<IconButton
					aria-label={'Close modal'}
					colorScheme={'gray'}
					icon={<CrossIcon />}
					onClick={() => {
						onClose();
					}}
				/>
			</HStack>
			<Divider />
			<VStack align={'stretch'} spacing={4}>
				<div style={{ height: 2 }} />
				<HStack justify={'space-between'} align={'center'}>
					<Heading size={'sm'}>Project</Heading>
					<Text>Name</Text>
				</HStack>
				<HStack justify={'space-between'} align={'center'}>
					<Heading size={'sm'}>Size</Heading>
					<Text>{humanFileSize(file?.bytes)}</Text>
				</HStack>
				<div style={{ height: 2 }} />
			</VStack>
			<Divider />
			<VStack align={'stretch'} spacing={4}>
				<div style={{ height: 2 }} />
				<Heading size={'sm'}>File description</Heading>
				{file.url && file.type === 'picture' && (
					<Image borderRadius={12} objectFit="cover" src={file.url} alt="Segun Adebayo" />
				)}
			</VStack>
			<Spacer />
			<Divider />
			<div style={{ height: 2 }} />
			<HStack justify={'space-between'} align={'center'}>
				<VStack justify={'center'} align={'center'}>
					<a href={file.url} target={'_blank'} rel={'noopener noreferrer'}>
						<IconButton
							aria-label={'Download'}
							colorScheme={'black'}
							icon={<DownloadIcon color={'white'} />}
						/>
					</a>
					<Text color={'black'} fontSize={'xs'}>
						Download
					</Text>
				</VStack>
				<VStack justify={'center'} align={'center'}>
					<IconButton
						aria-label={'Delete'}
						colorScheme={'black'}
						icon={<TrashIcon color={'white'} />}
						onClick={() => {
							console.log('DELETE');
						}}
					/>
					<Text color={'black'} fontSize={'xs'}>
						Delete
					</Text>
				</VStack>
			</HStack>
		</VStack>
	);
};
