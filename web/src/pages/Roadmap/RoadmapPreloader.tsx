import {
	Box,
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	Flex,
	Heading,
	Link,
	Text
} from '@chakra-ui/react';
import { NumberParam, useQueryParam } from 'use-query-params';
import { Center } from '../../components/Center';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { NoProjectsFound } from '../../components/empty/NoProjectsFound';
import { useProjectList } from '../../queries/useProjectList';
import { Roadmap } from './Roadmap';

export const RoadmapPreloader = (): JSX.Element => {
	const [projectId] = useQueryParam('project', NumberParam);
	console.log({ projectId });
	const { data, isPending, isError, error } = useProjectList();

	if (!isPending && isError) {
		// TODO Replace with ErrorBoundary
		return <p>{error?.errorText}</p>;
	}

	if (!isPending && data.length === 0) {
		return <NoProjectsFound />;
	}

	const selectedProject = data.find((p) => p.projectId === projectId);

	const pageTitle = 'Gant chart';
	const breadcrumbs = [{ title: 'Gant chart', url: '/gant-chart' }];

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
											<BreadcrumbLink as={Link} to={breadcrumb.url}>
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
				</Flex>
			</Box>
			<Box p={2}>
				{isPending ? (
					<Center>
						<LoadingSpinner />
					</Center>
				) : (
					<Roadmap projects={data} selectedProject={selectedProject} />
				)}
			</Box>
		</>
	);
};
