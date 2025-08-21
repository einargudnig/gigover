import { Heading, HStack, VStack } from '@chakra-ui/react';
import { SimpleGrid } from '../../../components/SimpleGrid';
import { useOpenProjects } from '../../../hooks/useAvailableProjects';
import { useProjectList } from '../../../queries/useProjectList';
import { Folder } from '../components/Folder';
import { DataFetchingErrorBoundary } from '../../../components/ErrorBoundary';

// For the Tender Folder
import { CardBaseLink } from '../../../components/CardBase';
import { FolderIcon } from '../../../components/icons/FolderIcon';
import { ApiService } from '../../../services/ApiService';
import { useQueryClient } from '@tanstack/react-query';

export const FilesHome = (): JSX.Element => {
	const { data, isPending, isError, error } = useProjectList();

	const projects = useOpenProjects(data);

	const queryClient = useQueryClient();

	return (
		<div>
			<VStack alignItems={'flex-start'} style={{ width: '100%' }} spacing={4}>
				<DataFetchingErrorBoundary
					name="FilesList"
					apiEndpoint={ApiService.projectList}
					loadingState={isPending}
					onRetry={() =>
						queryClient.invalidateQueries({ queryKey: [ApiService.projectList] })
					}
					skeletonCount={8}
				>
					{isError ? (
						(() => {
							throw error;
						})()
					) : (
						<SimpleGrid itemWidth={320}>
							{projects.map((p) => (
								<Folder key={p.projectId} project={p} />
							))}
							<TenderFolder />
						</SimpleGrid>
					)}
				</DataFetchingErrorBoundary>
			</VStack>
		</div>
	);
};

export const TenderFolder = ({ selected }: { selected?: boolean }): JSX.Element => {
	return (
		<CardBaseLink
			to={'/files/tender'}
			sx={{
				...(selected && {
					bg: 'black',
					color: '#fff !important',
					boxShadow: 'none',
					_hover: {
						bg: 'black', // Keep background black on hover when selected
						color: '#fff !important' // Keep text white on hover when selected
					}
				})
			}}
		>
			<VStack align={'stretch'} spacing={4}>
				<HStack justify={'space-between'} align={'center'}>
					<FolderIcon size={38} color={selected ? 'white' : 'gray'} />
				</HStack>
				<Heading
					as={'h4'}
					size={'sm'}
					fontWeight={'normal'}
					color={selected ? 'white' : 'inherit'}
				>
					Tender & Offers
				</Heading>
				<HStack justify={'space-between'}></HStack>
			</VStack>
		</CardBaseLink>
	);
};
