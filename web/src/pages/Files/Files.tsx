import {
	Box,
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	Button,
	Flex,
	HStack,
	Heading,
	Text,
	VStack
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { Link, Outlet, useParams } from 'react-router-dom';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { DisabledComponent } from '../../components/disabled/DisabledComponent';
import { DisabledPage } from '../../components/disabled/DisbledPage';
import { useOpenProjects } from '../../hooks/useAvailableProjects';
import { Project } from '../../models/Project';
import { useProjectList } from '../../queries/useProjectList';
import { UploadModal } from './UploadModal';
import { CreateNewFolderButton } from './components/CreateNewFolder';

export const Files = (): JSX.Element => {
	const { data, isPending } = useProjectList();
	const params = useParams();
	const [project, setProject] = useState<Project | null>(null);
	const [upload, setUpload] = useState(false);

	const projects = useOpenProjects(data);

	useEffect(() => {
		if (projects.length > 0 && params.projectId) {
			const findProject = projects.find(
				(p) => p.projectId === parseInt(params.projectId as string)
			);

			if (findProject) {
				setProject(findProject);
				return;
			}
		}

		setProject(null);
	}, [projects, params.projectId]);

	const pageTitle = 'Files';
	const breadcrumbs = [
		{ title: 'Your files', url: '/files/' },
		...(project
			? [
					{
						title: project.name,
						url: '/files/' + project.projectId
					},
					...(params.fileId
						? [
								{
									title: '/**/File',
									url: '/files/' + project.projectId + '/file/' + params.fileId
								}
							]
						: [])
				]
			: [])
	];
	const pageActions = (
		<DisabledComponent>
			{project && <CreateNewFolderButton projectId={project.projectId} />}

			<Button ml={2} onClick={() => setUpload(true)}>
				Upload
			</Button>
		</DisabledComponent>
	);

	return (
		<>
			{upload && (
				<UploadModal
					projectId={project?.projectId || undefined}
					folderId={params?.folderId || undefined}
					onClose={() => {
						setUpload(false);
					}}
					onComplete={(status) => {
						// devInfo('status', status);
						console.log('status', status);
					}}
				/>
			)}
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
				<DisabledPage>
					<VStack style={{ height: '100%' }}>
						{isPending ? (
							<LoadingSpinner />
						) : (
							<HStack style={{ flex: 1, height: '100%', width: '100%' }}>
								<Box p={3} overflowY="auto" height={'100%'} width={'100%'}>
									<Outlet />
								</Box>
							</HStack>
						)}
					</VStack>
				</DisabledPage>
			</Box>
		</>
	);
};
