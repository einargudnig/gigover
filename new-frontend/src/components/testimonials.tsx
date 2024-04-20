import { Box, Flex, Text, Image } from '@chakra-ui/react';
import { Theme } from '../theme';

export const Testimonials = () => {
	return (
		<Box marginTop={24} marginBottom={10} backgroundColor={Theme.backgroundColors.yellow}>
			<Flex justifyContent={'center'} alignItems={'center'}>
				<Box marginRight={10} width={'60%'}>
					<Flex flexDirection={'column'} alignItems={'start'} justifyContent={'center'}>
						<Text fontSize="  xl">
							Gigover saves me so much time. I don't get endless emails when closing a
							project now. Everything is in one place and people are accountable for
							their part of the job in a very visual way.
						</Text>
						<Text>Ivar Hilmarsson - owner</Text>
						<Text>Stjornumalun, Inc.</Text>
					</Flex>
				</Box>
				<Box>
					<Image src="https://placehold.co/220x350" alt="Testimonial 1" rounded={'md'} />
				</Box>
			</Flex>
		</Box>
	);
};
