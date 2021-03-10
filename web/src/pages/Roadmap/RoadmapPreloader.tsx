import React from 'react';
import { Page } from '../../components/Page';
import { useProjectList } from '../../queries/useProjectList';
import { Center } from '../../components/Center';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Roadmap } from './Roadmap';
import { NoProjectsFound } from '../../components/empty/NoProjectsFound';

export const RoadmapPreloader = (): JSX.Element => {
	const { data, isLoading, isError, error } = useProjectList();

	if (!isLoading && isError) {
		// TODO Replace with ErrorBoundary
		return <p>{error}</p>;
	}

	return !isLoading && data && data?.projects.length > 0 ? (
		<Roadmap projects={data!.projects} />
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
