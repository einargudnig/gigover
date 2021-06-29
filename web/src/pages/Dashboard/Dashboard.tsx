import React, { useContext, useState } from 'react';
import { Page } from '../../components/Page';
import { useProjectList } from '../../queries/useProjectList';
import { ProjectCard } from '../../components/ProjectCard';
import { DashboardTabs } from './DashboardTabs';
import { ProjectStatus } from '../../models/Project';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Center } from '../../components/Center';
import { NoProjectsFound } from '../../components/empty/NoProjectsFound';
import { ClockIcon } from '../../components/icons/ClockIcon';
import { PlusIcon } from '../../components/icons/PlusIcon';
import { Button, IconButton, SimpleGrid, VStack } from '@chakra-ui/react';
import { ModalContext } from '../../context/ModalContext';
import { Theme } from '../../Theme';
import { UploadIcon } from '../../components/icons/UploadIcon';

export const Dashboard = (): JSX.Element => {
	const [, setModalContext] = useContext(ModalContext);
	const [activeTab, setActiveTab] = useState(ProjectStatus.OPEN);
	const { data, isLoading, isError, error } = useProjectList();

	if (isError) {
		return (
			<p>
				Error: {error?.errorText} - Code: {error?.errorCode}
			</p>
		);
	}

	const projects = data.filter(
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
			actions={
				<>
					<IconButton
						variant={'outline'}
						colorScheme={'gray'}
						aria-label={'Track time'}
						onClick={() => {
							setModalContext({
								timeTracker: {
									project: undefined,
									task: undefined
								}
							});
						}}
						icon={<ClockIcon />}
					/>
					<Button
						onClick={() => setModalContext({ modifyProject: { project: undefined } })}
						leftIcon={<PlusIcon />}
					>
						New project
					</Button>
				</>
			}
		>
			{isLoading ? (
				<Center>
					<LoadingSpinner />
				</Center>
			) : (
				<VStack>
					<Center>
						{!projects || projects.length <= 0 ? (
							<NoProjectsFound />
						) : (
							<SimpleGrid columns={[1, null, 3]} spacing={Theme.padding(3)}>
								{projects.map((project) => (
									<ProjectCard key={project.projectId} project={project} />
								))}
							</SimpleGrid>
						)}
					</Center>
				</VStack>
			)}
		</Page>
	);
};
