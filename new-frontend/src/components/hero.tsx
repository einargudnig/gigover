import { Box, Button, Flex, Text, Image } from '@chakra-ui/react';
// import { Computer } from './computer';
// import { Phone } from './phone';

export const Hero = () => {
	return (
		<Flex flexDirection={'column'} justifyContent={'center'} alignItems={'center'}>
			<Box>
				<Text fontSize="4xl">Maintenance and construction projects made easy</Text>
			</Box>
			<Box marginTop={10}>
				<Text fontSize="2xl">
					Simplify your project management from initiation to closing.
				</Text>
				<Text fontSize="2xl">
					Streamline your process and ensure efficient execution at each stage.
				</Text>
			</Box>
			<Box marginTop={10}>
				<Flex justifyContent={'center'} flexDirection={'column'} alignItems={'center'}>
					<Button>Start free trial</Button>
					<Text marginTop={4}>No credit card needed</Text>
				</Flex>
			</Box>
			<Box marginTop={10} position="relative">
				<Flex position="relative">
					<Image src="https://placehold.co/600x400" alt="App screenshot" rounded="md" />

					<Image
						src="https://placehold.co/220x350/orange/white"
						alt="Mobile app screenshot"
						rounded="md"
						position="absolute"
						bottom={10}
						right={-8}
						transform="translate(50%, 50%)"
					/>
				</Flex>
			</Box>
		</Flex>
	);
};
