import { NumberParam, useQueryParam } from 'use-query-params';
import { Center } from '../../components/Center';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Page } from '../../components/Page';
import { NoProjectsFound } from '../../components/empty/NoProjectsFound';
import { useProjectList } from '../../queries/useProjectList';
import { Roadmap } from './Roadmap';

export const RoadmapPreloader = (): JSX.Element => {
	const [projectId] = useQueryParam('project', NumberParam);
	const { data, isLoading, isError, error } = useProjectList();

	if (!isLoading && isError) {
		// TODO Replace with ErrorBoundary
		return <p>{error?.errorText}</p>;
	}

	return !isLoading && data && data.length > 0 ? (
		<Roadmap
			projects={data}
			selectedProject={projectId ? data.find((p) => p.projectId === projectId) : undefined}
		/>
	) : (
		<Page title={'Gant chart'} backgroundColor={'#fff'}>
			{isLoading ? (
				<Center>
					<LoadingSpinner />
				</Center>
			) : (
				<NoProjectsFound />
			)}
		</Page>
	);
};
