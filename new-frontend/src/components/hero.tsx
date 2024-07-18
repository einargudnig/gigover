import { Box, Button, Flex, Heading, Image, Text } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import hero from '/hero.png';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Hero = ({ data }: any) => {
	return (
		<Box>
			<Flex flexDirection={'column'} justifyContent={'center'} alignItems={'center'}>
				<Box textAlign={'center'}>
					<Heading as="h1">{data?.heading}</Heading>
				</Box>
				<Box marginTop={10}>
					<Flex flexDirection={'column'} justifyContent={'center'} textAlign={'center'}>
						{/* <Text fontSize="2xl">{data?.content}</Text> */}
						<Text fontSize="2xl">
							Simplify your project management from initiation to closing.
						</Text>
						<Text fontSize="2xl">
							Streamline your process and ensure efficient execution at each stage.
						</Text>
					</Flex>
				</Box>
				<Box marginTop={10}>
					<Flex justifyContent={'center'} flexDirection={'column'} alignItems={'center'}>
						<Button>
							<Link to="https://web.gigover.com/">Start free trial</Link>
						</Button>
						<Text fontSize={'12px'} marginTop={4}>
							No credit card required
						</Text>
					</Flex>
				</Box>
				<Box marginTop={4}>
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
		</Box>
	);
};
