import { Box, Button, Flex, Text, Image } from '@chakra-ui/react';
// import { Page } from '../types';
// import { Computer } from './computer';
// import { Phone } from './phone';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Hero = ({ data }: any) => {
	console.log('in hero', { data });
	return (
		<Flex flexDirection={'column'} justifyContent={'center'} alignItems={'center'}>
			<Box>
				<Text fontSize={['3xl', '4xl']} textAlign={'center'}>
					{data?.heading}
				</Text>
			</Box>
			<Box marginTop={10}>
				<Flex justifyContent={'center'} textAlign={'center'}>
					<Text fontSize="2xl">{data?.content}</Text>
				</Flex>
			</Box>
			<Box marginTop={10}>
				<Flex justifyContent={'center'} flexDirection={'column'} alignItems={'center'}>
					<Button>Start free trial</Button>
					<Text marginTop={4}>No credit card needed</Text>
				</Flex>
			</Box>
			<Box marginTop={10}>
				<Image src={data?.image.url} />
			</Box>
			{/* <Box marginTop={10} position="relative">
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
			</Box> */}
		</Flex>
	);
};
