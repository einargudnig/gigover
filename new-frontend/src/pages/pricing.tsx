import { Box, Flex, HStack, Spacer, Table, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react';

export const Pricing = (): JSX.Element => {
	return (
		<>
			<Text fontSize="2xl">Pricing</Text>
			<Flex justifyContent={'space-around'} alignItems={'center'} marginTop={10}>
				<Box rounded={'md'} borderColor={'black'} p={2} border="1px" marginRight={10}>
					<Text fontSize="3xl">Free</Text>
					<Box>
						<Flex alignItems={'baseline'}>
							<Text as="sub">$</Text>
							<Text fontSize="lg">16</Text>
							<Text>/Month</Text>
						</Flex>
					</Box>
					<Text fontSize="md">Up to 5 users</Text>
				</Box>
				<Spacer />
				<Box rounded={'md'} borderColor={'black'} p={2} border="1px">
					<Text fontSize="xl">Pro</Text>
					<Text fontSize="lg">10$</Text>
					<Text fontSize="md">Up to 10 users</Text>
				</Box>
			</Flex>
			<Flex flexDirection={'column'} marginTop={20}>
				<Flex justifyContent={'space-around'}>
					<Box maxW={96}>
						<Text>
							You can invite stakeholders to your project. Your clients, outside
							contractors, vendors and guests can all be invited to collaborate on
							projects. Risk-free, cancel anytime, no long-term lock in.
						</Text>
						<Text>Cancellation is entirely self-service, no questions asked.</Text>
						<br />
						<Text>
							The Construction Industry Institute (CII) reported that companies that
							use project management practices could experience a 20% reduction in
							construction cost and up to 30% reduction in construction time.
						</Text>
						<br />
						<Text>
							Similarly, a study by the Project Management Institute (PMI) found that
							organisations that align their project management practices with their
							business strategy can achieve a 36% higher success rate for their
							projects and a 27% higher return on investment (ROI) compared to those
							that do not.
						</Text>
						<br />
						<Text>
							For example, a study by the Construction Industry Institute (CII) found
							that use of competitive bidding processes for procurement can experience
							up to a 14% reduction in materials costs compared to those that do not.
						</Text>
					</Box>
					<Box>
						<Flex
							justifyContent={'center'}
							alignItems={'center'}
							flexDirection={'column'}
						>
							<Text fontSize="xl" as="b">
								Tiered pricing
							</Text>
							<Table>
								<Thead>
									<Tr>
										<Th>Type</Th>
										<Th>Seats</Th>
										<Th>Price</Th>
									</Tr>
								</Thead>
								<Tbody>
									<Tr>
										<Td>Basic</Td>
										<Td>2-10</Td>
										<Td>$ 15</Td>
									</Tr>
									<Tr>
										<Td>Standard</Td>
										<Td>11-30</Td>
										<Td>$ 13</Td>
									</Tr>
									<Tr>
										<Td>Pro</Td>
										<Td>31-60</Td>
										<Td>$ 11</Td>
									</Tr>
									<Tr>
										<Td>Premium</Td>
										<Td>61-90</Td>
										<Td>$ 9</Td>
									</Tr>
									<Tr>
										<Td>Premium plus</Td>
										<Td>91+</Td>
										<Td>$ 8</Td>
									</Tr>
								</Tbody>
							</Table>
						</Flex>
					</Box>
				</Flex>
				<Flex>
					<Box
						justifyContent={'center'}
						alignItems={'center'}
						marginTop={20}
						p={4}
						border="1px"
						rounded={'md'}
					>
						<HStack>
							<Text>Unlimited seats/buildings: </Text>
							<Text as="b">$2,500/month</Text>
						</HStack>
						<HStack>
							<Text>Suppliers/Vendors/Stores:</Text>
							<Text as="b">
								$1,500/month or 2.5$ of total price per successful bid - pay per
								sale (PPS)
							</Text>
						</HStack>
						<Text marginTop={6}>
							App users in iOS or Android use the app for free. You can find the app
							on the App Store (iOS) or Google Play Store (Android)
						</Text>
					</Box>
				</Flex>
			</Flex>
		</>
	);
};
