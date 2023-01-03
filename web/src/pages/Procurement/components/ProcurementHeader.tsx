import React from 'react';
import { Box, Center, Flex, Heading, HStack, Text, VStack } from '@chakra-ui/react';

export const ProcurementHeader = (): JSX.Element => {
	return (
		<>
			<Center>
				<Heading as={'h4'} size={'md'}>
					Procurement
				</Heading>
			</Center>
			<Center>
				<Flex direction={'column'}>
					<Box
						mb={2}
						p={4}
						borderRadius={8}
						borderColor={'#EFEFEE'}
						bg={'#EFEFEE'}
						w={'100%'}
					>
						<HStack>
							<VStack>
								<HStack>
									<Text fontWeight={'bold'} fontSize={'lg'}>
										Buyer:
									</Text>
									<Text>Einar</Text>
								</HStack>
								<HStack>
									<Text fontWeight={'bold'} fontSize={'lg'}>
										Name:
									</Text>
									<Text>Einar</Text>
								</HStack>
								<HStack>
									<Text fontWeight={'bold'} fontSize={'lg'}>
										Address:
									</Text>
									<Text>Dufnaholar 10</Text>
								</HStack>
								<HStack>
									<Text fontWeight={'bold'} fontSize={'lg'}>
										Delivery:
									</Text>
									<Text>Yes, I need a big car</Text>
								</HStack>
							</VStack>
							<VStack>
								<HStack>
									<Text fontWeight={'bold'} fontSize={'lg'}>
										Date:
									</Text>
									<Text>22 December</Text>
								</HStack>
								<HStack>
									<Text fontWeight={'bold'} fontSize={'lg'}>
										Seller:
									</Text>
									<Text>BYKO</Text>
								</HStack>
								<HStack>
									<Text fontWeight={'bold'} fontSize={'lg'}>
										Phone:
									</Text>
									<Text>12345678</Text>
								</HStack>
								<HStack>
									<Text fontWeight={'bold'} fontSize={'lg'}>
										Delivery Address:
									</Text>
									<Text>Dufnaholar 10</Text>
								</HStack>
							</VStack>
						</HStack>
					</Box>
				</Flex>
			</Center>
		</>
	);
};
