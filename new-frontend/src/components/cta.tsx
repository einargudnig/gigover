import { Box, Text, Flex, Button } from '@chakra-ui/react';

export const Cta = () => {
	return (
		<Box marginTop={24}>
			<Flex flexDirection={'column'} justifyContent={'center'} alignItems={'center'}>
				<Text fontSize="4xl" as="b">
					Get in control of your projects today
				</Text>
				<Text fontSize="2xl" marginTop={8} marginBottom={8}>
					Help your maintenance and construction work stay on schedule and on budget!
				</Text>
				<Button>Start free trial</Button>
			</Flex>
		</Box>
	);
};
