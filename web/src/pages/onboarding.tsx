import React from 'react';
import { Box, Flex, Grid, GridItem, Text } from '@chakra-ui/react';
import { GigoverLogo } from '../components/GigoverLogo';

export const Onboarding = (): JSX.Element => {
	return (
		<Box minH="100vh" p="4">
			<GigoverLogo scale={0.7} color="black" />

			<Box p="4">
				<Grid gap={4} templateColumns="repeat(2, 1fr)">
					<GridItem>
						<Box>
							<Text fontSize="2xl" fontWeight="bold">
								Welcome to Gigover!
							</Text>
							<Text fontSize="lg">
								We are excited to have you on board. Please fill in the following
								information to get started.
							</Text>
						</Box>
						<Box>{/* Registration form */}</Box>
					</GridItem>
					<GridItem>Image!</GridItem>
				</Grid>
			</Box>
		</Box>
	);
};
