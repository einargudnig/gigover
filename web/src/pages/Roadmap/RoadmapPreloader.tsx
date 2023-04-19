import React from 'react';
import { Page } from '../../components/Page';
import { useProjectList } from '../../queries/useProjectList';
import { Center } from '../../components/Center';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Roadmap } from './Roadmap';
import { NoProjectsFound } from '../../components/empty/NoProjectsFound';
import { useQueryParam, NumberParam } from 'use-query-params';

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
