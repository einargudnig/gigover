import React from 'react';
import { devError } from '../../../utils/ConsoleUtils';
import { useParams } from 'react-router-dom';
import { LoadingSpinner } from '../../../components/LoadingSpinner';
import { useProjectFoldersQuery } from '../../../queries/useProjectFoldersQuery';
import { CreateNewFolder } from '../../Files/components/CreateNewFolder';
import { VStack, Spacer } from '@chakra-ui/react';
import { SimpleGrid } from '../../../components/SimpleGrid';

export const ProcurementFolder = (): JSX.Element => {
	const params = useParams();
	const projectId = params.projectId ? parseInt(params.projectId) : -1;

	const { data, isLoading, isError, error } = useProjectFoldersQuery(projectId);
	// ! We need a endpoint that gets all tenders with certain projectId
	// All tenders for project x -> similar to useProjectDocuements
	// const projectDocuments = useProjectDocuments(projectId);

	if (isLoading) {
		return <LoadingSpinner />;
	}

	if (isError && error) {
		devError(error);
		throw new Error('Error loading procurement folders, Reason: ' + error);
	}

	if (!projectId) {
		return <div>Missing Project Id</div>;
	}

	return (
		<>
			{data.length ? (
				<CreateNewFolder projectId={projectId} />
			) : (
				<>
					<VStack
						mb={'4'}
						alignItems={'flex-start'}
						style={{ width: '100%' }}
						spacing={4}
					>
						<SimpleGrid itemWidth={320}>
							{/* {data?.map((folder) => (
								<ProjectFolderComponent />
							))} */}
						</SimpleGrid>
					</VStack>
					<CreateNewFolder projectId={projectId} />
				</>
			)}

			<Spacer height={4} />
			{/* <FilesUi title={''} files={projectDocuments?.data ?? []} projectId={projectId} /> */}
		</>
	);
};
