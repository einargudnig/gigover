import { Box, Flex, Text, Image, Spacer } from '@chakra-ui/react';

export const Overview = () => {
	return (
		<Box marginTop={36}>
			<Flex flexDirection={'column'} alignItems={'center'}>
				<Text fontSize="2xl">Help your maintenance and construction projects</Text>
				<Text fontSize="2xl">stay on schedule and on budget!</Text>
			</Flex>

			<Box marginTop={10}>
				<Flex justifyContent={'space-between'} alignItems={'center'}>
					<Box>
						<Image
							src="https://placehold.co/400x200"
							alt="App screenshot"
							rounded="md"
						/>
					</Box>
					<Spacer />
					<Box marginLeft={10}>
						<Text fontSize="2xl" as="b">
							Plan
						</Text>
						<Text fontSize="xl" marginTop={4}>
							Plan your project with a clear scope and timeline.
						</Text>
					</Box>
				</Flex>
			</Box>
		</Box>
	);
};
