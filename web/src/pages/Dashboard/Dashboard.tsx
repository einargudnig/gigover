import { Button, IconButton, VStack } from '@chakra-ui/react';
import { useContext, useEffect, useState } from 'react';
import { Theme } from '../../Theme';
import { Center } from '../../components/Center';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Page } from '../../components/Page';
import { SortableProjectList } from '../../components/SortableProjectList';
import { NoProjectsFound } from '../../components/empty/NoProjectsFound';
import { PlusIcon } from '../../components/icons/PlusIcon';
import { TimeIcon } from '../../components/icons/TimeIcon';
import { ModalContext } from '../../context/ModalContext';
import { ProgressStatus } from '../../models/ProgressStatus';
import { ProjectStatus } from '../../models/Project';
import { useProgressStatusList } from '../../queries/useProgressStatusList';
import { useProjectList } from '../../queries/useProjectList';
import { SearchBar } from '../Property/components/SearchBar';
import { DashboardTabs } from './DashboardTabs';
import { useFilterProjectsBy } from './hooks/useFilterProjectsBy';

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
					<SearchBar />
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
