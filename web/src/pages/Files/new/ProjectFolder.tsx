import { Spacer, VStack } from '@chakra-ui/react';
import { useState } from 'react';
import { pdfjs } from 'react-pdf';
import { useParams } from 'react-router-dom';
import { LoadingSpinner } from '../../../components/LoadingSpinner';
import { SimpleGrid } from '../../../components/SimpleGrid';
import { useProjectDocuments } from '../../../queries/useProjectDocuments';
import { useProjectFoldersQuery } from '../../../queries/useProjectFoldersQuery';
import { devError } from '../../../utils/ConsoleUtils';
import { CreateNewFolder } from '../components/CreateNewFolder';
import { ProjectFolderComponent } from '../components/Folder';
import { FilesUi } from './components/FilesUi';

// Set workerSrc for pdfjs
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.js';

export const ProjectFolder = (): JSX.Element => {
	const params = useParams();
	const projectId = params.projectId ? parseInt(params.projectId) : -1;

	const { data, isPending, isError, error } = useProjectFoldersQuery(projectId);
	const projectDocuments = useProjectDocuments(projectId);

	const [numPages, setNumPages] = useState<number | null>(null);

	function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
		setNumPages(numPages);
	}

	if (isPending) {
		return <LoadingSpinner />;
	}

	if (isError && error) {
		devError(error);
		throw new Error('Error loading project folders, Reason: ' + error);
	}

	if (!projectId) {
		return <div>Missing Project Id</div>;
	}

	return (
		<>
			{!data?.length ? (
				<CreateNewFolder projectId={projectId} />
			) : (
				<>
					<VStack mb={4} alignItems={'flex-start'} style={{ width: '100%' }} spacing={4}>
						<SimpleGrid itemWidth={320}>
							{data?.map((folder) => (
								<ProjectFolderComponent
									key={folder.folderId}
									folder={folder}
									projectId={projectId}
								/>
							))}
						</SimpleGrid>
					</VStack>
					<CreateNewFolder projectId={projectId} />
				</>
			)}

			<Spacer height={4} />
			<FilesUi title={''} files={projectDocuments?.data ?? []} projectId={projectId} />

			{/* <div>
				<Document
					file="/sample.pdf" // Place sample.pdf in your public/ folder
					onLoadSuccess={onDocumentLoadSuccess}
				>
					<Page pageNumber={1} />
				</Document>
				{numPages && <p>Page 1 of {numPages}</p>}
			</div> */}
		</>
	);
};
