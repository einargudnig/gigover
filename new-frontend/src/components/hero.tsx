import { Box, Button, Flex, Text, Image } from '@chakra-ui/react';

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
					<Button size={'xl'}>Start free trial</Button>
					<Text marginTop={4}>No credit card needed</Text>
				</Flex>
			</Box>
			<Box marginTop={10}>
				<Image src={data?.image.url} rounded="md" alt="App screenshot" />
			</Box>
		</Flex>
	);
};
