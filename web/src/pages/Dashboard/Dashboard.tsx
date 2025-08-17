import {
	Box,
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	Button,
	Flex,
	HStack,
	Heading,
	IconButton,
	Link,
	Menu,
	MenuButton,
	MenuItemOption,
	MenuList,
	MenuOptionGroup,
	Text,
	Tooltip,
	VStack
} from '@chakra-ui/react';
import { useContext, useEffect, useState } from 'react';
import DataFetchingErrorBoundary from '../../components/ErrorBoundary/DataFetchingErrorBoundary';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { NewProjectOverview } from '../../components/NewProjectOverview';
import { DisabledComponent } from '../../components/disabled/DisabledComponent';
import { NoProjectsFound } from '../../components/empty/NoProjectsFound';
import { FilterIcon } from '../../components/icons/FilterIcon';
import { SearchIcon } from '../../components/icons/SearchIcon';
import { ModalContext } from '../../context/ModalContext';
import { ProgressStatus } from '../../models/ProgressStatus';
import { ProjectStatus } from '../../models/Project';
import { useProgressStatusList } from '../../queries/useProgressStatusList';
import { useProjectList } from '../../queries/useProjectList';
import { ApiService } from '../../services/ApiService';
import { ProjectSearchBar } from './ProjectSearchBar';
import { useFilterProjectsBy } from './hooks/useFilterProjectsBy';
import { useQueryClient } from '@tanstack/react-query';

export const Dashboard = (): JSX.Element => {
	const { data: statuses, isPending: isPendingStatuses } = useProgressStatusList();
	const { data, isPending: isPendingProjects, isError, error } = useProjectList();
	const [, setModalContext] = useContext(ModalContext);
	const [counter, setCounter] = useState(0);
	const [activeTab, setActiveTab] = useState<string | ProgressStatus>(ProjectStatus.OPEN);
	const [showSearch, setShowSearch] = useState(false);
	const queryClient = useQueryClient();

	const projects = useFilterProjectsBy(activeTab, data, isPendingProjects);

	// Debug log: print the order and lexoRanks of the projects passed to NewProjectOverview
	// if (projects && projects.length > 0) {
	// 	console.log('Projects passed to NewProjectOverview:');
	// 	projects.forEach((p, i) => {
	// 		console.log(`${i + 1}: ${p.name} (lexoRank: ${p.lexoRank})`);
	// 	});
	// }

	useEffect(() => {
		if (!isPendingProjects) {
			setCounter((v) => ++v);
		}
	}, [projects, activeTab, isPendingProjects]);

	const pageTitle = 'Dashboard';
	const breadcrumbs = [{ title: 'Projects', url: '/' }];
	const pageActions = (
		<Box display={'flex'} gap={2} alignItems={'center'} py={2}>
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
				{isPendingStatuses ? (
					<LoadingSpinner />
				) : (
					<MenuList>
						<MenuOptionGroup
							defaultValue={'OPEN'}
							title="Project statuses"
							type="radio"
						>
							<MenuItemOption
								value="OPEN"
								style={{ textTransform: 'capitalize' }}
								onClick={() => setActiveTab(ProjectStatus.OPEN)}
							>
								{ProjectStatus.OPEN.toLowerCase()}
							</MenuItemOption>
							<MenuItemOption
								value="ALL"
								style={{ textTransform: 'capitalize' }}
								onClick={() => setActiveTab(ProjectStatus.ALL)}
							>
								{ProjectStatus.ALL.toLowerCase()}
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
			<DisabledComponent>
				<Button onClick={() => setModalContext({ modifyProject: { project: undefined } })}>
					New project
				</Button>
			</DisabledComponent>
		</Box>
	);

	return (
		<>
			<Box
				as="header"
				borderBottom="1px solid"
				borderColor="gray.200"
				boxShadow="6px 6px 25px rgba(0, 0, 0, 0.03)"
				bg="white" // Or transparent if Page.tsx sets a default bg for content
				mb={4} // Margin to separate from content
				px={3}
			>
				<Flex justifyContent="space-between" alignItems="center">
					<Box>
						{breadcrumbs ? (
							<Breadcrumb
								spacing="8px"
								// separator={<Chevron direction="right" color={Theme.colors.green} />}
							>
								{breadcrumbs.map((breadcrumb, bIndex) => (
									<BreadcrumbItem key={bIndex}>
										{breadcrumb.url ? (
											<BreadcrumbLink as={Link} href={breadcrumb.url}>
												{breadcrumb.title}
											</BreadcrumbLink>
										) : (
											<Text as="span">{breadcrumb.title}</Text> // For non-link breadcrumbs
										)}
									</BreadcrumbItem>
								))}
							</Breadcrumb>
						) : (
							<Heading as="h1" size="lg" color="black">
								{pageTitle}
							</Heading>
						)}
					</Box>
					<HStack spacing={2}>{pageActions}</HStack>
				</Flex>
			</Box>
			<Box p={2}>
				<DataFetchingErrorBoundary
					name="ProjectList"
					apiEndpoint={ApiService.projectList}
					loadingState={isPendingProjects}
					onRetry={() =>
						queryClient.invalidateQueries({ queryKey: [ApiService.projectList] })
					}
				>
					{isError ? (
						(() => {
							throw error;
						})()
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
				</DataFetchingErrorBoundary>
			</Box>
		</>
	);
};
