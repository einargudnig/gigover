import {
	Button,
	IconButton,
	Menu,
	MenuButton,
	MenuItemOption,
	MenuList,
	MenuOptionGroup,
	Tooltip,
	VStack
} from '@chakra-ui/react';
import { useContext, useEffect, useState } from 'react';
import { Center } from '../../components/Center';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { NewProjectOverview } from '../../components/NewProjectOverview';
import { Page } from '../../components/Page';
import { NoProjectsFound } from '../../components/empty/NoProjectsFound';
import { FilterIcon } from '../../components/icons/FilterIcon';
import { SearchIcon } from '../../components/icons/SearchIcon';
import { ModalContext } from '../../context/ModalContext';
import { ProgressStatus } from '../../models/ProgressStatus';
import { ProjectStatus } from '../../models/Project';
import { useProgressStatusList } from '../../queries/useProgressStatusList';
import { useProjectList } from '../../queries/useProjectList';
import { ProjectSearchBar } from './ProjectSearchBar';
import { useFilterProjectsBy } from './hooks/useFilterProjectsBy';

export const Dashboard = (): JSX.Element => {
	const { data: statuses, isLoading: isLoadingStatuses } = useProgressStatusList();
	const { data, isLoading: isLoadingProjects, isError, error } = useProjectList();
	const [, setModalContext] = useContext(ModalContext);
	const [counter, setCounter] = useState(0);
	const [activeTab, setActiveTab] = useState<string | ProgressStatus>(ProjectStatus.OPEN);
	const [showSearch, setShowSearch] = useState(false);

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
			title={'Projects'}
			actions={
				<>
					{showSearch ? (
						<ProjectSearchBar />
					) : (
						<Tooltip hasArrow label="Search for project">
							<IconButton
								variant={'outline'}
								aria-label={'Search'}
								colorScheme={'gray'}
								icon={<SearchIcon color={'black'} />}
								onClick={() => setShowSearch((v) => !v)}
							/>
						</Tooltip>
					)}
					<Menu>
						<Tooltip hasArrow label="Filter project status">
							<MenuButton
								as={IconButton}
								variant={'outline'}
								colorScheme={'gray'}
								aria-label={'Filter'}
								icon={<FilterIcon color={'black'} />}
							/>
						</Tooltip>
						{isLoadingStatuses ? (
							<LoadingSpinner />
						) : (
							<MenuList>
								<MenuOptionGroup
									defaultValue={'ALL'}
									title="Project statuses"
									type="radio"
								>
									<MenuItemOption
										value="ALL"
										style={{ textTransform: 'capitalize' }}
										onClick={() => setActiveTab(ProjectStatus.ALL)}
									>
										{ProjectStatus.ALL.toLowerCase()}
									</MenuItemOption>
									<MenuItemOption
										value="OPEN"
										style={{ textTransform: 'capitalize' }}
										onClick={() => setActiveTab(ProjectStatus.OPEN)}
									>
										{ProjectStatus.OPEN.toLowerCase()}
									</MenuItemOption>
									{statuses?.progressStatusList?.map((status) => (
										<MenuItemOption
											key={status.id}
											value={status.name}
											onClick={() => setActiveTab(status)}
										>
											{status.name}
										</MenuItemOption>
									))}
									<MenuItemOption
										value="CLOSED"
										style={{ textTransform: 'capitalize' }}
										onClick={() => setActiveTab(ProjectStatus.CLOSED)}
									>
										{ProjectStatus.CLOSED.toLowerCase()}
									</MenuItemOption>
								</MenuOptionGroup>
							</MenuList>
						)}
					</Menu>
					<Button
						onClick={() => setModalContext({ modifyProject: { project: undefined } })}
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
						<NewProjectOverview
							key={`projects_${counter}_${projects.length}`}
							list={projects}
						/>
					)}
				</VStack>
			)}
		</Page>
	);
};
