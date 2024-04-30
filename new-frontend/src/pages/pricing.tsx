import { useLocation } from 'react-router-dom';
import {
	Box,
	Button,
	Flex,
	Grid,
	GridItem,
	HStack,
	Table,
	Tbody,
	Td,
	Text,
	Th,
	Thead,
	Tr
} from '@chakra-ui/react';
import { LoadingSpinner } from '../components/loading-spinner';
import { Center } from '../components/center';
import { usePage } from '../queries/usePage';
import { PricePlan, PageBlock } from '../types';

export const Pricing = (): JSX.Element => {
	const location = useLocation();

	const variable = {
		slug: location.pathname.split('/')[1]
	};
	const { data, isLoading } = usePage(variable);

	return (
		<>
			<Text fontSize="4xl">{data?.page.name}</Text>
			{isLoading ? (
				<Center>
					<LoadingSpinner />
				</Center>
			) : (
				<>
					<Grid marginTop={10} templateColumns="repeat(2, 1fr)">
						{/* // eslint-disable-next-line @typescript-eslint/no-explicit-any */}
						{data?.page.pricePlans.map((pricePlan: PricePlan) => (
							<>
								<GridItem>
									<Box
										rounded={'md'}
										borderColor={'black'}
										p={6}
										border="1px"
										marginRight={10}
										height={64}
									>
										<Flex flexDirection={'column'} alignItems={'center'}>
											<Text fontSize="3xl">{pricePlan?.name}</Text>
											<Box>
												<Flex alignItems={'baseline'}>
													<Text fontSize={'small'}>$</Text>
													<Text fontSize="2xl" as="b">
														{pricePlan?.monthlyPrice}
													</Text>
													<Text>/Month</Text>
												</Flex>
											</Box>
											<Text fontSize="sm" marginTop={4}>
												{pricePlan?.description}
											</Text>
											<Box marginTop={4}>
												<Button>Try free for 30 days</Button>
											</Box>
										</Flex>
									</Box>
								</GridItem>
							</>
						))}
					</Grid>
					<Flex flexDirection={'column'} marginTop={20}>
						<Flex justifyContent={'space-around'}>
							<Box maxW={96}>
								{data?.page.pageBlocks.map((content: PageBlock) => (
									<>
										{content.content &&
											content.content
												.split(/(?<=\.)\s+/)
												.map((sentence: string, index: number) => (
													<Text key={index} mb={2} as="p">
														{sentence}
													</Text>
												))}
									</>
								))}
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
										$1,500/month or 2.5$ of total price per successful bid - pay
										per sale (PPS)
									</Text>
								</HStack>
								<Text marginTop={6}>
									App users in iOS or Android use the app for free. You can find
									the app on the App Store (iOS) or Google Play Store (Android)
								</Text>
							</Box>
						</Flex>
					</Flex>
				</>
			)}
		</>
	);
};
