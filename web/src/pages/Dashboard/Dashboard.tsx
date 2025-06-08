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
	Spinner,
	Text,
	Tooltip,
	VStack
} from '@chakra-ui/react';
import { useContext, useEffect, useState } from 'react';
import { Center } from '../../components/Center';
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
import { useProjectsInfiniteScroll } from '../../queries/useProjectListInfinite';
import { ProjectSearchBar } from './ProjectSearchBar';
import { useFilterProjectsBy } from './hooks/useFilterProjectsBy';

export const Dashboard = (): JSX.Element => {
	const { data: statuses, isPending: isPendingStatuses } = useProgressStatusList();
	const [, setModalContext] = useContext(ModalContext);
	const [counter, setCounter] = useState(0);
	const [activeTab, setActiveTab] = useState<string | ProgressStatus>(ProjectStatus.OPEN);
	const [showSearch, setShowSearch] = useState(false);

	// Use infinite scroll hook
	const {
		allProjects,
		loadMoreRef,
		hasMore,
		totalCount,
		visibleCount,
		isLoading: isPendingProjects,
		isFetching,
		error
	} = useProjectsInfiniteScroll(20, 10);

	// Filter the projects (now using allProjects for filtering, but will display visibleProjects)
	const filteredProjects = useFilterProjectsBy(activeTab, allProjects, isPendingProjects);

	useEffect(() => {
		if (!isPendingProjects) {
			setCounter((v) => ++v);
		}
	}, [filteredProjects, activeTab, isPendingProjects]);

	if (error) {
		return (
			<p>
				Error: {error?.errorText} - Code: {error?.errorCode}
			</p>
		);
	}

	const isLoading = isPendingStatuses || isFetching;

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
				bg="white"
				mb={4}
				px={3}
			>
				<Flex justifyContent="space-between" alignItems="center">
					<Box>
						{breadcrumbs ? (
							<Breadcrumb spacing="8px">
								{breadcrumbs.map((breadcrumb, bIndex) => (
									<BreadcrumbItem key={bIndex}>
										{breadcrumb.url ? (
											<BreadcrumbLink as={Link} to={breadcrumb.url}>
												{breadcrumb.title}
											</BreadcrumbLink>
										) : (
											<Text as="span">{breadcrumb.title}</Text>
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
				{isLoading && filteredProjects.length === 0 ? (
					<Center>
						<LoadingSpinner />
					</Center>
				) : (
					<VStack width={'100%'} align={'stretch'}>
						{!filteredProjects || filteredProjects.length <= 0 ? (
							<NoProjectsFound />
						) : (
							<>
								<NewProjectOverview
									key={`projects_${counter}_${filteredProjects.length}`}
									list={filteredProjects}
								/>

								{/* Infinite Scroll Trigger */}
								{hasMore && (
									<Flex
										ref={loadMoreRef}
										h="60px"
										align="center"
										justify="center"
										my={4}
									>
										<HStack spacing={3}>
											<Spinner size="sm" color="blue.500" />
											<Text fontSize="sm" color="gray.600">
												Loading more projects...
											</Text>
										</HStack>
									</Flex>
								)}

								{/* Progress indicator */}
								{totalCount > 0 && (
									<Flex justify="center" py={4}>
										<Text fontSize="sm" color="gray.600">
											Showing {visibleCount} of {totalCount} projects
										</Text>
									</Flex>
								)}

								{/* End message */}
								{!hasMore && filteredProjects.length > 0 && (
									<Flex justify="center" py={4}>
										<Text fontSize="sm" color="gray.500">
											You&apos;ve reached the end! 🎉
										</Text>
									</Flex>
								)}
							</>
						)}
					</VStack>
				)}
			</Box>
		</>
	);
};
