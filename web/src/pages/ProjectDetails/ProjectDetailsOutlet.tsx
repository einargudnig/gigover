import { Box, Button, Flex, HStack, IconButton, Spacer, Text, VStack } from '@chakra-ui/react';
import { useState } from 'react';
import { NavLink, Outlet, useLocation, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { Page } from '../../components/Page';
import { FilterIcon } from '../../components/icons/FilterIcon';
import { SearchIcon } from '../../components/icons/SearchIcon';
import { ManageProjectWorkers } from '../../components/modals/ManageProjectWorkers';
import { Project } from '../../models/Project';
import { useProjectDetails } from '../../queries/useProjectDetails';

const Container = styled.div`
	flex: 1 0;
	height: 100%;
	overflow-y: auto;
`;

export const ProjectDetailsOutlet = (): JSX.Element => {
	const { projectId } = useParams();
	console.log({ projectId });
	const projectIdNumber = parseInt(projectId as string);
	const [manageWorkers, setManageWorkers] = useState(false);
	const location = useLocation();

	const showSearchIcon = location.pathname === `/project/${projectId}/files`;
	const showFilterIcon = location.pathname === `/project/${projectId}`;

	const [showSearch, setShowSearch] = useState(false);

	const { data, isLoading, isError, error } = useProjectDetails(projectIdNumber);
	const project: Project | undefined = data && data.project;

	return (
		<>
			{manageWorkers && project && (
				<ManageProjectWorkers onClose={() => setManageWorkers(false)} project={project} />
			)}
			<Page
				actions={
					!isLoading &&
					project && (
						<>
							{project.owner && (
								<Button
									colorScheme={'yellow'}
									onClick={() => setManageWorkers(true)}
								>
									Add members
								</Button>
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
					>
						<Box>
							<HStack>
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
							</HStack>
						</Box>
						<Spacer />
						<Box>
							{showSearchIcon ? (
								<>
									{showSearch ? (
										// <SearchBar />
										<Text>Test</Text>
									) : (
										<IconButton
											variant={'outline'}
											aria-label={'Search'}
											colorScheme={'gray'}
											icon={<SearchIcon color={'black'} />}
											onClick={() => setShowSearch((v) => !v)}
										/>
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
