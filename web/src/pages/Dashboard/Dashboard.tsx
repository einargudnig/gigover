import React, { useContext, useMemo, useState } from 'react';
import { Page } from '../../components/Page';
import { useProjectList } from '../../queries/useProjectList';
import { DashboardTabs } from './DashboardTabs';
import { ProjectStatus } from '../../models/Project';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Center } from '../../components/Center';
import { NoProjectsFound } from '../../components/empty/NoProjectsFound';
import { ClockIcon } from '../../components/icons/ClockIcon';
import { PlusIcon } from '../../components/icons/PlusIcon';
import { Button, IconButton, VStack } from '@chakra-ui/react';
import { ModalContext } from '../../context/ModalContext';
import { SortableProjectList } from '../../components/SortableProjectList';

export const Dashboard = (): JSX.Element => {
	const { data, isLoading, isError, error } = useProjectList();
	const [, setModalContext] = useContext(ModalContext);
	const [activeTab, setActiveTab] = useState(ProjectStatus.OPEN);

	if (isError) {
		return (
			<p>
				Error: {error?.errorText} - Code: {error?.errorCode}
			</p>
		);
	}

	const projects = useMemo(() => {
		return data.filter(
			(project) =>
				project.status !== ProjectStatus.DONE &&
				(activeTab === ProjectStatus.ALL || project.status === activeTab)
		);
	}, [data, activeTab]);

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
				<VStack width={'100%'} align={'stretch'}>
					{!projects || projects.length <= 0 ? (
						<NoProjectsFound />
					) : (
						<SortableProjectList
							key={`projects_${activeTab}_${projects.length}`}
							list={projects}
						/>
					)}
				</VStack>
			)}
		</Page>
	);
};
