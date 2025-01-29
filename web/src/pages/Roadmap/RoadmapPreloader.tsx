import { NumberParam, useQueryParam } from 'use-query-params';
import { Center } from '../../components/Center';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Page } from '../../components/Page';
import { NoProjectsFound } from '../../components/empty/NoProjectsFound';
import { useProjectList } from '../../queries/useProjectList';
import { Roadmap } from './Roadmap';

export const RoadmapPreloader = (): JSX.Element => {
	const [projectId] = useQueryParam('project', NumberParam);
	console.log({ projectId });
	const { data, isLoading, isError, error } = useProjectList();

	if (!isLoading && isError) {
		// TODO Replace with ErrorBoundary
		return <p>{error?.errorText}</p>;
	}

	if (!isLoading && data.length === 0) {
		return <NoProjectsFound />;
	}

	const selectedProject = data.find((p) => p.projectId === projectId);

	return (
		<Page title={'Gant chart'} backgroundColor={'#fff'}>
			{isLoading ? (
				<Center>
					<LoadingSpinner />
				</Center>
			) : (
				<Roadmap projects={data} selectedProject={selectedProject} />
			)}
		</Page>
	);
};
