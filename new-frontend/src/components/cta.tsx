import { Box, Text, Flex, Button } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

export const Cta = ({ bgColor, buttonColor }: { bgColor: string; buttonColor: string }) => {
	return (
		<Box marginTop={24} backgroundColor={bgColor} p={10}>
			<Flex flexDirection={'column'} justifyContent={'center'} alignItems={'center'}>
				<Box textAlign={'center'}>
					<Text fontSize="4xl">Get in control of your projects today</Text>
				</Box>
				<Text fontSize="2xl" marginTop={8} marginBottom={8} textAlign={'center'}>
					Help your work stay on schedule and on budget!
				</Text>
				<Button size={'lg'} colorScheme={buttonColor}>
					<Link to="https://web.gigover.com/">Start free trial</Link>
				</Button>
			</Flex>
		</Box>
	);
};
