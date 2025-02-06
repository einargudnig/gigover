import { Box, Flex, Heading, Text } from '@chakra-ui/react';
import { Projects } from './Projects';
import { ProjectOnProperty } from '../../../models/Property';
import { Center } from '../../../components/Center';
import { LoadingSpinner } from '../../../components/LoadingSpinner';

export function ProjectsTab({
	projects,
	isFetching
}: {
	projects: ProjectOnProperty[];
	isFetching: boolean;
}): JSX.Element {
	return (
		<Box mb={3} p={4} borderRadius={8} borderColor={'#EFEFEE'} bg={'white'} w="100%">
			<Flex mb={8} alignItems={'start'}>
				<Box>
					<Heading mb={'4'} fontSize={'xl'}>
						Projects
					</Heading>
				</Box>
			</Flex>
			{!projects || projects.length === 0 ? (
				<Text m={4}>No projects!</Text>
			) : (
				<>
					{isFetching ? (
						<Center>
							<LoadingSpinner />
						</Center>
					) : (
						projects?.map((project) => (
							<Projects project={project} key={project.projectId} />
						))
					)}
				</>
			)}
		</Box>
	);
}
