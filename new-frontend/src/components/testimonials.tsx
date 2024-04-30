import { Box, Flex, Text, Image } from '@chakra-ui/react';
import { Theme } from '../theme';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Testimonials = ({ data }: any) => {
	console.log({ data });
	return (
		<Box marginTop={24} marginBottom={10} backgroundColor={Theme.backgroundColors.yellow}>
			<Flex justifyContent={'center'} alignItems={'center'}>
				<Box marginRight={10} width={'60%'}>
					<Flex flexDirection={'column'} alignItems={'start'} justifyContent={'center'}>
						<Text fontSize="xl">{data?.testimonials[0].testimonial}</Text>
						<Text>{data?.testimonials[0].name}</Text>
						<Text>{data?.testimonials[0].company}</Text>
					</Flex>
				</Box>
				<Box>
					<Image
						src={data?.testimonials[0].image.url}
						alt="Testimonial 1"
						rounded={'md'}
						height={'350px'}
						width={'220px'}
					/>
				</Box>
			</Flex>
		</Box>
	);
};
