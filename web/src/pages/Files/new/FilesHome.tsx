import { Heading, HStack, VStack } from '@chakra-ui/react';
import { SimpleGrid } from '../../../components/SimpleGrid';
import { useOpenProjects } from '../../../hooks/useAvailableProjects';
import { useProjectList } from '../../../queries/useProjectList';
import { Folder } from '../components/Folder';

// For the Tender Folder
import styled, { css } from 'styled-components';
import { CardBaseLink } from '../../../components/CardBase';
import { FolderIcon } from '../../../components/icons/FolderIcon';
import { LoadingSpinner } from '../../../components/LoadingSpinner';

export const FilesHome = (): JSX.Element => {
	const { data, isLoading } = useProjectList();

	const projects = useOpenProjects(data);

	if (isLoading) {
		return <LoadingSpinner />;
	}

	return (
		<div>
			<VStack alignItems={'flex-start'} style={{ width: '100%' }} spacing={4}>
				<SimpleGrid itemWidth={320}>
					{projects.map((p) => (
						<Folder key={p.projectId} project={p} />
					))}
					<TenderFolder />
				</SimpleGrid>
			</VStack>
		</div>
	);
};

const FolderCard = styled(CardBaseLink)<{ selected?: boolean }>`};
	${(props) =>
		props.selected &&
		css`
			background: #000;
			color: #fff !important;
			box-shadow: none;
		`};
`;

export const TenderFolder = (): JSX.Element => {
	return (
		<FolderCard to={'/files/tender'}>
			<VStack align={'stretch'} spacing={4}>
				<HStack justify={'space-between'} align={'center'}>
					<FolderIcon size={38} color={'gray'} />
				</HStack>
				<Heading as={'h4'} size={'sm'} fontWeight={'normal'}>
					Tender & Offers
				</Heading>
				<HStack justify={'space-between'}></HStack>
			</VStack>
		</FolderCard>
	);
};
