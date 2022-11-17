import React from 'react';
import { Box, Center, Flex, Heading, HStack, Text } from '@chakra-ui/react';

export const ProcurementHeader = (): JSX.Element => {
	return (
		<>
			<Center>
				<Heading as={'h4'} size={'md'}>
					Procurement
				</Heading>
			</Center>
			<Flex direction={'column'}>
				<Box mb={2} p={2} borderRadius={6} bg={'#EFEFEF'} borderColor={'#EFEFEE'}>
					<HStack>
						<Text>Buyer:</Text>
						<Text>Name:</Text>
						<Text>Address:</Text>
						<Text>Delivery:</Text>
					</HStack>
					<HStack>
						<Text>Date:</Text>
						<Text>Seller:</Text>
						<Text>Phone:</Text>
						<Text>Delivery Address:</Text>
					</HStack>
				</Box>
			</Flex>
		</>
	);
};
