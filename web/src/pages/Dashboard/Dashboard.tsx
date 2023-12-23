import React, { useContext, useEffect, useState } from 'react';
import { Page } from '../../components/Page';
import { useProjectList } from '../../queries/useProjectList';
import { DashboardTabs } from './DashboardTabs';
import { ProjectStatus } from '../../models/Project';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Center } from '../../components/Center';
import { NoProjectsFound } from '../../components/empty/NoProjectsFound';
import { TimeIcon } from '../../components/icons/TimeIcon';
import { PlusIcon } from '../../components/icons/PlusIcon';
import { Button, IconButton, VStack } from '@chakra-ui/react';
import { ModalContext } from '../../context/ModalContext';
import { SortableProjectList } from '../../components/SortableProjectList';
import { useProgressStatusList } from '../../queries/useProgressStatusList';
import { ProgressStatus } from '../../models/ProgressStatus';
import { useFilterProjectsBy } from './hooks/useFilterProjectsBy';
import { Theme } from '../../Theme';
import { SearchBar } from '../Property/components/SearchBar';

export const Dashboard = (): JSX.Element => {
	const { data: statuses, isLoading: isLoadingStatuses } = useProgressStatusList();
	const { data, isLoading: isLoadingProjects, isError, error } = useProjectList();
	const [, setModalContext] = useContext(ModalContext);
	const [counter, setCounter] = useState(0);
	const [activeTab, setActiveTab] = useState<string | ProgressStatus>(ProjectStatus.OPEN);

	const projects = useFilterProjectsBy(activeTab, data, isLoadingProjects);

	useEffect(() => {
		if (!isLoadingProjects) {
			setCounter((v) => ++v);
		}
	}, [projects, activeTab, isLoadingProjects]);

	if (isError) {
		return (
			<p>
				Error: {error?.errorText} - Code: {error?.errorCode}
			</p>
		);
	}

	const isLoading = isLoadingProjects || isLoadingStatuses;

	return (
		<Page
			title={'Dashboard'}
			tabs={
				<VStack>
					<SearchBar property={[]} />
					<DashboardTabs
						statuses={statuses?.progressStatusList ?? []}
						activeTab={activeTab}
						onChange={(tab) => setActiveTab(tab)}
					/>
				</VStack>
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
						icon={<TimeIcon color={Theme.colors.darkBlue} />}
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
							key={`projects_${counter}_${projects.length}`}
							list={projects}
						/>
					)}
				</VStack>
			)}
		</Page>
	);
};
