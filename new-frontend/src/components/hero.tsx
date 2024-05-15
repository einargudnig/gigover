import { Box, Button, Flex, Text, Image, Heading } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import hero from '/hero1.png';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Hero = ({ data }: any) => {
	console.log('in hero', { data });
	return (
		<Flex flexDirection={'column'} justifyContent={'center'} alignItems={'center'}>
			<Box textAlign={'center'}>
				<Heading as="h1">{data?.heading}</Heading>
			</Box>
			<Box marginTop={10}>
				<Flex justifyContent={'center'} textAlign={'center'}>
					<Text fontSize="2xl">{data?.content}</Text>
				</Flex>
			</Box>
			<Box marginTop={10}>
				<Flex justifyContent={'center'} flexDirection={'column'} alignItems={'center'}>
					<Button>
						<Link to="https://web.gigover.com/">Start free trial</Link>
					</Button>
					<Text marginTop={4}>No credit card needed</Text>
				</Flex>
			</Box>
			<Box>
				<Flex justifyContent={'center'} alignItems={'center'}>
					<Image
						// src={data?.image.url}
						src={hero}
						rounded="md"
						alt="Mobile and desktop screenshot"
						width={['100%', '85%']}
					/>
				</Flex>
			</Box>
		</Flex>
	);
};
