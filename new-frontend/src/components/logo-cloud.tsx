import { Box, Text, Image, Grid, Flex } from '@chakra-ui/react';

export const LogoCloud = () => {
	return (
		<Box marginTop={44}>
			<Flex justifyContent={'center'} flexDirection={'column'} alignItems={'center'}>
				<Text fontSize="2xl">Trusted by dozens of customers just like you</Text>

				<Box marginTop={8}>
					<Grid templateColumns="repeat(6, 1fr)" gap={6}>
						<Image
							src="https://via.placeholder.com/120"
							alt="Logo cloud"
							rounded={'md'}
						/>
						<Image
							src="https://via.placeholder.com/120"
							alt="Logo cloud"
							rounded={'md'}
						/>
						<Image
							src="https://via.placeholder.com/120"
							alt="Logo cloud"
							rounded={'md'}
						/>
						<Image
							src="https://via.placeholder.com/120"
							alt="Logo cloud"
							rounded={'md'}
						/>
						<Image
							src="https://via.placeholder.com/120"
							alt="Logo cloud"
							rounded={'md'}
						/>
						<Image
							src="https://via.placeholder.com/120"
							alt="Logo cloud"
							rounded={'md'}
						/>
					</Grid>
				</Box>
			</Flex>
		</Box>
	);
};
