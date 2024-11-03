import {
	Box,
	Button,
	Flex,
	HStack,
	IconButton,
	Spacer,
	Text,
	Tooltip,
	VStack,
	useDisclosure
} from '@chakra-ui/react';
import { useState } from 'react';
import { NavLink, Outlet, useLocation, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { Page } from '../../components/Page';
import { FilterIcon } from '../../components/icons/FilterIcon';
import { SearchIcon } from '../../components/icons/SearchIcon';
import { ManageProjectWorkers } from '../../components/modals/ManageProjectWorkers';
import { Project } from '../../models/Project';
import { useProjectDetails } from '../../queries/useProjectDetails';
import { useProjectDocuments } from '../../queries/useProjectDocuments';
import { SearchBar } from '../Files/components/SearchBar';
import { FileHouseIcon } from '../../components/icons/FileTypes/FileHouseIcon';
import { ProjectToPropertyModal } from '../../components/modals/PropertyModals/ProjectToProperty';
import { useGetUserPrivileges } from '../../hooks/useGetUserPrivileges';

const Container = styled.div`
	flex: 1 0;
	height: 100%;
	overflow-y: auto;
`;

export const ProjectDetailsOutlet = (): JSX.Element => {
	const params = useParams();
	const projectId = params.projectId ? parseInt(params.projectId) : -1;
	const { privileges, activeOrg } = useGetUserPrivileges();

	const [manageWorkers, setManageWorkers] = useState(false);
	const location = useLocation();
	const { isOpen, onOpen, onClose } = useDisclosure();
	const showSearchIcon = location.pathname === `/project/${projectId}/files`;
	const showFilterIcon = false;

	const [showSearch, setShowSearch] = useState(false);

	const { data, isLoading, isError, error } = useProjectDetails(projectId);
	const project: Project | undefined = data && data.project;

	const { data: projectDocuments } = useProjectDocuments(projectId);

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
			<Page
				actions={
					!isLoading &&
					project && (
						<>
							{project.owner && (
								<Tooltip hasArrow label="Add members to project">
									<Button
										colorScheme={'yellow'}
										onClick={() => setManageWorkers(true)}
									>
										Add members
									</Button>
								</Tooltip>
							)}
						</>
					)
				}
				breadcrumbs={[
					{ title: 'Projects', url: '/' },
					...(isLoading ? [] : [{ title: project?.name || '' }])
				]}
				extraNav={
					<Flex
						borderBottom={'1px'}
						backgroundColor={'white'}
						borderColor={'gray.400'}
						alignItems={'center'}
						px={3}
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
							<>
								{activeOrg ? (
									<>
										{privileges?.includes('ADMIN') ||
										privileges.includes('EDITOR') ? (
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
										) : (
											<Tooltip hasArrow label="You do not have permssion!">
												<IconButton
													variant={'outline'}
													colorScheme={'gray'}
													aria-label={'Connect to property'}
													icon={<FileHouseIcon color={'black'} />}
													marginLeft={3}
													onClick={onOpen}
													isDisabled
												/>
											</Tooltip>
										)}
									</>
								) : (
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
								)}
							</>
						</Box>
					</Flex>
				}
			>
				<VStack style={{ height: '100%' }}>
					<HStack style={{ flex: 1, height: '100%', width: '100%' }}>
						<Container>
							<Outlet />
						</Container>
					</HStack>
				</VStack>
			</Page>
		</>
	);
};
