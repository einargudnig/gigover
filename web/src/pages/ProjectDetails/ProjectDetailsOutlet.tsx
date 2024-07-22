import { Box, Button, Flex, HStack, IconButton, Spacer, Text, VStack } from '@chakra-ui/react';
import { useState } from 'react';
import { NavLink, Outlet, useParams } from 'react-router-dom';
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
	const projectIdNumber = parseInt(projectId as string);
	const [manageWorkers, setManageWorkers] = useState(false);

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
								<NavLink to={`/project/${projectId}`}>
									{({ isActive }) => (
										<Box as="button" borderBottom={isActive ? '1px' : 'hidden	'}>
											Board
										</Box>
									)}
								</NavLink>
								<NavLink to={`/roadmap?project=${projectId}`}>
									{({ isActive }) => (
										<Box as="button" borderBottom={isActive ? '1px' : 'hidden	'}>
											Gantt
										</Box>
									)}
								</NavLink>
								<NavLink to={`/files/${projectId}`}>
									{({ isActive }) => (
										<Box as="button" borderBottom={isActive ? '1px' : 'hidden	'}>
											Files
										</Box>
									)}
								</NavLink>
							</HStack>
						</Box>
						<Spacer />
						<Box>
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
							<IconButton
								variant={'outline'}
								colorScheme={'gray'}
								aria-label={'Filter'}
								icon={<FilterIcon color={'black'} />}
								marginLeft={3}
							/>
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
