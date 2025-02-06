import { Box, Heading, Spacer, Text } from '@chakra-ui/react';
import { Projects } from './Projects';
import { ProjectOnProperty } from '../../../models/Property';

export function ProjectsTab({ projects }: { projects: ProjectOnProperty[] }): JSX.Element {
	return (
		<Box mb={3} p={4} borderRadius={8} borderColor={'#EFEFEE'} bg={'white'} w="100%">
			<Box>
				<Heading fontSize={'xl'}>Projects</Heading>
			</Box>
			<Spacer />
			{!projects || projects.length === 0 ? (
				<Text m={4}>No projects!</Text>
			) : (
				projects?.map((project) => <Projects project={project} key={project.projectId} />)
			)}
		</Box>
	);
}
