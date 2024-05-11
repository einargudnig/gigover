import { Box, Text, Flex, Button } from '@chakra-ui/react';

export const Cta = () => {
	return (
		<Box marginTop={24} backgroundColor={'gray.800'} p={4} rounded={'md'}>
			<Flex flexDirection={'column'} justifyContent={'center'} alignItems={'center'}>
				<Box textAlign={'center'}>
					<Text fontSize="4xl" as="b" textColor={'white'}>
						Get in control of your projects today
					</Text>
				</Box>
				<Text
					fontSize="2xl"
					marginTop={8}
					marginBottom={8}
					textAlign={'center'}
					textColor={'white'}
				>
					Help your maintenance and construction work stay on schedule and on budget!
				</Text>
				<Button size={'lg'}>Start free trial</Button>
			</Flex>
		</Box>
	);
};
