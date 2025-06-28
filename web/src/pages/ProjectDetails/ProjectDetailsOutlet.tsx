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
	Spacer,
	Text,
	Tooltip,
	VStack,
	useDisclosure
} from '@chakra-ui/react';
import { useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useParams } from 'react-router-dom';
import { DisabledComponent } from '../../components/disabled/DisabledComponent';
import { FileHouseIcon } from '../../components/icons/FileTypes/FileHouseIcon';
import { FilterIcon } from '../../components/icons/FilterIcon';
import { SearchIcon } from '../../components/icons/SearchIcon';
import { ManageProjectWorkers } from '../../components/modals/ManageProjectWorkers';
import { ProjectToPropertyModal } from '../../components/modals/PropertyModals/ProjectToProperty';
import { Project } from '../../models/Project';
import { useProjectDetails } from '../../queries/useProjectDetails';
import { useProjectDocuments } from '../../queries/useProjectDocuments';
import { SearchBar } from '../Files/components/SearchBar';

export const ProjectDetailsOutlet = (): JSX.Element => {
	const params = useParams();
	const projectId = params.projectId ? parseInt(params.projectId) : -1;

	const [manageWorkers, setManageWorkers] = useState(false);
	const location = useLocation();
	const { isOpen, onOpen, onClose } = useDisclosure();
	const showSearchIcon = location.pathname === `/project/${projectId}/files`;
	const showFilterIcon = false;

	const [showSearch, setShowSearch] = useState(false);

	const { data, isPending: isLoading, isError, error } = useProjectDetails(projectId);
	const project: Project | undefined = data && data.project;

	const { data: projectDocuments } = useProjectDocuments(projectId);

	const pageTitle = 'Project';
	const breadcrumbs = [{ title: 'Projects', url: '/' }, { title: project?.name || '' }];
	const pageActions = (
		<Box display={'flex'} gap={2} alignItems={'center'} py={2} height={'50px'}>
			{!isLoading && project && (
				<>
					{project?.owner && (
						<Tooltip hasArrow label="Add members to project">
							<Button colorScheme={'yellow'} onClick={() => setManageWorkers(true)}>
								Add members
							</Button>
						</Tooltip>
					)}
				</>
			)}
		</Box>
	);
	const extraNav = (
		<Flex
			borderTop={'1px solid'}
			borderBottom={'1px'}
			backgroundColor={'white'}
			borderColor={'gray.400'}
			alignItems={'center'}
			py={1}
			height={'50px'}
		>
			<Box>
				<HStack>
					<Tooltip hasArrow label="View kanban board">
						<NavLink to={`/project/${projectId}`} end>
							{({ isActive }) => (
								<Box
									as="button"
									borderBottom={isActive ? '2px' : 'hidden	'}
									borderColor={'blue.400'}
								>
									Board
								</Box>
							)}
						</NavLink>
					</Tooltip>
					<Tooltip hasArrow label="View gantt chart">
						<NavLink to={'gantt'}>
							{({ isActive }) => (
								<Box
									as="button"
									borderBottom={isActive ? '2px' : 'hidden	'}
									borderColor={'blue.400'}
								>
									Gantt
								</Box>
							)}
						</NavLink>
					</Tooltip>
					<Tooltip hasArrow label="View project files">
						<NavLink to={'files'}>
							{({ isActive }) => (
								<Box
									as="button"
									borderBottom={isActive ? '2px' : 'hidden	'}
									borderColor={'blue.400'}
								>
									Files
								</Box>
							)}
						</NavLink>
					</Tooltip>
				</HStack>
			</Box>
			<Spacer />
			<Box>
				<Flex>
					{showSearchIcon ? (
						<>
							{showSearch ? (
								<SearchBar files={projectDocuments} />
							) : (
								<Tooltip hasArrow label="Search project files">
									<IconButton
										variant={'outline'}
										aria-label={'Search'}
										colorScheme={'gray'}
										icon={<SearchIcon color={'black'} />}
										onClick={() => setShowSearch((v) => !v)}
									/>
								</Tooltip>
							)}
						</>
					) : null}
					{showFilterIcon ? (
						<IconButton
							variant={'outline'}
							colorScheme={'gray'}
							aria-label={'Filter'}
							icon={<FilterIcon color={'black'} />}
							marginLeft={3}
						/>
					) : null}
					<DisabledComponent>
						<Tooltip hasArrow label="Connect to property">
							<IconButton
								variant={'outline'}
								colorScheme={'gray'}
								aria-label={'Connect to property'}
								icon={<FileHouseIcon color={'black'} />}
								marginLeft={3}
								onClick={onOpen}
							/>
						</Tooltip>
					</DisabledComponent>
				</Flex>
			</Box>
		</Flex>
	);

	return (
		<>
			<ProjectToPropertyModal projectId={projectId} isOpen={isOpen} onClose={onClose} />
			{isError && (
				<>
					<Text>Oh no! An unexpected error.</Text>
					<Text textColor={'red.300'}>{error.errorText}</Text>
					<Text>{error.errorCode}</Text>
				</>
			)}
			{manageWorkers && project && (
				<ManageProjectWorkers onClose={() => setManageWorkers(false)} project={project} />
			)}
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
					{extraNav}
				</Box>
				<Box p={2}>
					<VStack style={{ height: '100%' }}>
						<HStack style={{ flex: 1, height: '100%', width: '100%' }}>
							<Box overflowY={'auto'} height={'100%'} width={'100%'}>
								<Outlet />
							</Box>
						</HStack>
					</VStack>
				</Box>
			</>
		</>
	);
};
