import { Box, Flex, Text, Image } from '@chakra-ui/react';
import { Theme } from '../theme';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Testimonials = ({ data }: any) => {
	return (
		<Box py={8} backgroundColor={Theme.backgroundColors.yellow} rounded={'md'}>
			<Flex
				flexDirection={['column-reverse', 'row']}
				justifyContent={'center'}
				alignItems={'center'}
			>
				<Box marginRight={[0, 10]} width={['80%', '60%']}>
					<Flex
						flexDirection={'column'}
						alignItems={['center', 'start']}
						justifyContent={'center'}
					>
						<Text fontSize="xl" marginTop={[6, 0]} textAlign={['center', 'start']}>
							{data?.testimonials[0].testimonial}
						</Text>
						<Box marginTop={[6, 2]} marginBottom={[4, 0]}>
							<Flex flexDir={'column'}>
								<Text as="b">{data?.testimonials[0].name}</Text>
								<Text as="em">{data?.testimonials[0].company}</Text>
							</Flex>
						</Box>
					</Flex>
				</Box>
				<Box marginTop={[4, 0]}>
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
