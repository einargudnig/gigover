import React, { useState } from 'react';
import styled from 'styled-components';
import { Page } from '../../components/Page';
import { useProjectList } from '../../queries/useProjectList';
import { ProjectCard } from '../../components/ProjectCard';
import { DashboardTabs } from './DashboardTabs';
import { ProjectStatus } from '../../models/Project';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Center } from '../../components/Center';
import { NoProjectsFound } from '../../components/empty/NoProjectsFound';

const ProjectDashboard = styled.div`
	display: flex;
	justify-content: flex-start;
	flex-wrap: wrap;
	padding: 16px 0;

	> * {
		margin: 16px;
	}
`;

export const Dashboard = (): JSX.Element => {
	const [activeTab, setActiveTab] = useState(ProjectStatus.OPEN);
	const { data, isLoading, isError, error } = useProjectList();

	if (isError) {
		return (
			<p>
				Error: {error?.errorText} - Code: {error?.errorCode}
			</p>
		);
	}

	const projects = data?.projects?.filter(
		(project) =>
			project.status !== ProjectStatus.DONE &&
			(activeTab === ProjectStatus.ALL || project.status === activeTab)
	);

	return (
		<Page
			title={'Dashboard'}
			tabs={
				<DashboardTabs
					tabs={[ProjectStatus.ALL, ProjectStatus.OPEN, ProjectStatus.CLOSED]}
					activeTab={activeTab}
					onChange={(tab) => setActiveTab(tab)}
				/>
			}
		>
			{isLoading ? (
				<Center>
					<LoadingSpinner />
				</Center>
			) : (
				<ProjectDashboard>
					{!projects || projects.length <= 0 ? (
						<NoProjectsFound />
					) : (
						projects.map((project) => (
							<ProjectCard key={project.projectId} project={project} />
						))
					)}
				</ProjectDashboard>
			)}
		</Page>
	);
};
