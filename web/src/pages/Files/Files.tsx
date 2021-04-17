import {
	Button,
	Heading,
	HStack,
	Input,
	InputGroup,
	InputRightElement,
	VStack
} from '@chakra-ui/react';
import React from 'react';
import { Page } from '../../components/Page';
import { UploadIcon } from '../../components/icons/UploadIcon';
import { SearchIcon } from '../../components/icons/SearchIcon';
import styled from 'styled-components';
import { FolderIcon } from '../../components/icons/FolderIcon';
import { useProjectList } from '../../queries/useProjectList';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { NoProjectsFound } from '../../components/empty/NoProjectsFound';
import { Folder } from './components/Folder';
import { ProjectStatus } from '../../models/Project';
import { SimpleGrid } from '../../components/SimpleGrid';

const Container = styled.div`
	flex: 1 0;
	height: 100%;
	padding: ${(props) => props.theme.padding(3)};
	overflow-y: auto;
`;

const SidebarContainer = styled(Container)`
	flex: 0 0 350px;
	background: #fff;
	box-shadow: ${(props) => props.theme.boxShadow()};
`;

export const Files = (): JSX.Element => {
	const { data, isLoading } = useProjectList();

	const projects = data?.projects.filter((p) => p.status !== ProjectStatus.CLOSED);

	return (
		<Page
			title={'Files'}
			tabs={
				<InputGroup>
					<Input
						name="search"
						placeholder="Search file system"
						variant={'filled'}
						style={{ minWidth: '400px' }}
					/>
					<InputRightElement pointerEvents={'none'}>
						<SearchIcon />
					</InputRightElement>
				</InputGroup>
			}
			contentPadding={false}
			actions={<Button leftIcon={<UploadIcon />}>Upload</Button>}
		>
			<VStack style={{ height: '100%' }}>
				{isLoading ? (
					<LoadingSpinner />
				) : (
					<HStack style={{ flex: 1, height: '100%', width: '100%' }}>
						<Container>
							<VStack alignItems={'flex-start'} style={{ width: '100%' }} spacing={4}>
								<HStack spacing={4}>
									<FolderIcon />
									<Heading as={'h4'} size={'md'}>
										All files
									</Heading>
								</HStack>
								{projects && projects.length > 0 ? (
									<SimpleGrid itemWidth={320}>
										{projects.map((p) => (
											<Folder key={p.projectId} project={p} />
										))}
									</SimpleGrid>
								) : (
									<NoProjectsFound />
								)}
							</VStack>
						</Container>
						<SidebarContainer>
							<p>HUDUDU</p>
							<p>HUDUDU</p>
							<p>HUDUDU</p>
							<p>HUDUDU</p>
							<p>HUDUDU</p>
							<p>HUDUDU</p>
							<p>HUDUDU</p>
							<p>HUDUDU</p>
							<p>HUDUDU</p>
							<p>HUDUDU</p>
							<p>HUDUDU</p>
							<p>HUDUDU</p>
							<p>HUDUDU</p>
							<p>HUDUDU</p>
							<p>HUDUDU</p>
							<p>HUDUDU</p>
							<p>HUDUDU</p>
							<p>HUDUDU</p>
							<p>HUDUDU</p>
							<p>HUDUDU</p>
							<p>HUDUDU</p>
							<p>HUDUDU</p>
							<p>HUDUDU</p>
							<p>HUDUDU</p>
							<p>HUDUDU</p>
							<p>HUDUDU</p>
							<p>HUDUDU</p>
							<p>HUDUDU</p>
							<p>HUDUDU</p>
							<p>HUDUDU</p>
							<p>HUDUDU</p>
							<p>HUDUDU</p>
							<p>HUDUDU</p>
							<p>HUDUDU</p>
							<p>HUDUDU</p>
							<p>HUDUDU</p>
							<p>HUDUDU</p>
							<p>HUDUDU</p>
							<p>HUDUDU</p>
							<p>HUDUDU</p>
							<p>HUDUDU</p>
							<p>HUDUDU</p>
							<p>HUDUDU</p>
							<p>HUDUDU</p>
							<p>HUDUDU</p>
							<p>HUDUDU</p>
							<p>HUDUDU</p>
							<p>HUDUDU</p>
							<p>HUDUDU</p>
							<p>HUDUDU</p>
							<p>HUDUDU</p>
							<p>HUDUDU</p>
							<p>HUDUDU</p>
							<p>HUDUDU</p>
							<p>HUDUDU</p>
							<p>HUDUDU</p>
							<p>HUDUDU</p>
							<p>HUDUDU</p>
							<p>HUDUDU</p>
							<p>HUDUDU</p>
							<p>HUDUDU</p>
							<p>HUDUDU</p>
							<p>HUDUDU</p>
							<p>HUDUDU</p>
							<p>HUDUDU</p>
							<p>HUDUDU</p>
							<p>HUDUDU</p>
							<p>HUDUDU</p>
							<p>HUDUDU</p>
							<p>HUDUDU</p>
							<p>HUDUDU</p>
							<p>HUDUDU</p>
							<p>HUDUDU</p>
							<p>HUDUDU</p>
							<p>HUDUDU</p>
							<p>HUDUDU</p>
							<p>HUDUDU</p>
							<p>HUDUDU</p>
							<p>HUDUDU</p>
							<p>HUDUDU</p>
							<p>HUDUDU</p>
							<p>HUDUDU</p>
							<p>HUDUDU</p>
							<p>HUDUDU</p>
							<p>HUDUDU</p>
							<p>HUDUDU</p>
							<p>HUDUDU</p>
							<p>HUDUDU</p>
							<p>HUDUDU</p>
							<p>HUDUDU</p>
							<p>HUDUDU</p>
							<p>HUDUDU</p>
							<p>HUDUDU</p>
							<p>HUDUDU</p>
							<p>HUDUDU</p>
							<p>HUDUDU</p>
							<p>HUDUDU</p>
							<p>HUDUDU</p>
							<p>HUDUDU</p>
							<p>HUDUDU</p>
							<p>HUDUDU</p>
							<p>HUDUDU</p>
							<p>HUDUDU</p>
						</SidebarContainer>
					</HStack>
				)}
			</VStack>
		</Page>
	);
};
