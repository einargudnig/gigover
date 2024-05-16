import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import {
	Container,
	Box,
	Button,
	Flex,
	HStack,
	Heading,
	List,
	ListIcon,
	ListItem,
	Stack,
	Table,
	Tbody,
	Td,
	Text,
	Th,
	Thead,
	Tr,
	VStack,
	useColorModeValue
} from '@chakra-ui/react';
import { CheckCircleIcon } from '@chakra-ui/icons';
import { LoadingSpinner } from '../components/loading-spinner';
import { Center } from '../components/center';
import { usePage } from '../queries/usePage';
import { PricePlan, PageBlock } from '../types';
import { ReactNode } from 'react';
import { FAQ } from '../components/faq';

export const Pricing = (): JSX.Element => {
	const location = useLocation();

	const variable = {
		slug: location.pathname.split('/')[1]
	};
	const { data, isLoading } = usePage(variable);
	console.log({ data });

	return (
		<>
			<Helmet>
				<title>Gigover | Pricing</title>
				<link rel="canonical" href="https://www.gigover.com/pricing" />
			</Helmet>
			{isLoading ? (
				<Center>
					<LoadingSpinner />
				</Center>
			) : (
				<>
					<Container maxW={'100%'} p="2">
						<Box py={12}>
							<VStack spacing={2} textAlign="center">
								<Heading as="h1" fontSize="4xl">
									Plans that fit your need
								</Heading>
								<Text fontSize="lg" color={'gray.500'}>
									Start with 30-day free trial. No credit card needed. Cancel at
									anytime.
								</Text>
							</VStack>

							<Stack
								direction={{ base: 'column', md: 'row' }}
								textAlign="center"
								justify="center"
								spacing={{ base: 4, lg: 10 }}
								py={10}
							>
								{/* // eslint-disable-next-line @typescript-eslint/no-explicit-any */}
								{data?.page.pricePlans.map((pricePlan: PricePlan) => (
									<PriceWrapper>
										<Box py={4} px={12}>
											<Text fontWeight="500" fontSize="2xl">
												{pricePlan?.name}
											</Text>
											<HStack justifyContent="center">
												<Text fontSize="3xl" fontWeight="600">
													$
												</Text>
												<Text fontSize="5xl" fontWeight="900">
													{pricePlan?.monthlyPrice}
												</Text>
												<Text fontSize="3xl" color="gray.500">
													/month
												</Text>
											</HStack>
										</Box>
										<Text
											fontSize="lg"
											color="gray.500"
											px={12}
											marginBottom={4}
										>
											{pricePlan?.description}
										</Text>
										<VStack
											// eslint-disable-next-line react-hooks/rules-of-hooks
											bg={useColorModeValue('gray.50', 'gray.700')}
											py={4}
											borderBottomRadius={'xl'}
										>
											<Box w="80%" py={7}>
												<Button
													w="full"
													colorScheme="yellow"
													variant="solid"
												>
													Start trial
												</Button>
											</Box>
											<List spacing={3} textAlign="start" px={12}>
												<ListItem>
													<ListIcon
														as={CheckCircleIcon}
														color="green.500"
													/>
													{pricePlan?.pricePlanFields[0].fieldKey}
													&nbsp;-&nbsp;
													{pricePlan?.pricePlanFields[0].fieldValue}
												</ListItem>
												<ListItem>
													<ListIcon
														as={CheckCircleIcon}
														color="green.500"
													/>
													{pricePlan?.pricePlanFields[1].fieldKey}
													&nbsp;-&nbsp;
													{pricePlan?.pricePlanFields[1].fieldValue}
												</ListItem>
												<ListItem>
													<ListIcon
														as={CheckCircleIcon}
														color="green.500"
													/>
													{pricePlan?.pricePlanFields[2].fieldKey}
													&nbsp;-&nbsp;
													{pricePlan?.pricePlanFields[2].fieldValue}
												</ListItem>
												<ListItem>
													<ListIcon
														as={CheckCircleIcon}
														color="green.500"
													/>
													{pricePlan?.pricePlanFields[3].fieldKey}
													&nbsp;-&nbsp;
													{pricePlan?.pricePlanFields[3].fieldValue}
												</ListItem>
												<ListItem>
													<ListIcon
														as={CheckCircleIcon}
														color="green.500"
													/>
													{pricePlan?.pricePlanFields[4].fieldKey}
													&nbsp;-&nbsp;
													{pricePlan?.pricePlanFields[4].fieldValue}
												</ListItem>
												<ListItem>
													<ListIcon
														as={CheckCircleIcon}
														color="green.500"
													/>
													{pricePlan?.pricePlanFields[5].fieldKey}
													&nbsp;-&nbsp;
													{pricePlan?.pricePlanFields[5].fieldValue}
												</ListItem>
												<ListItem>
													<ListIcon
														as={CheckCircleIcon}
														color="green.500"
													/>
													{pricePlan?.pricePlanFields[6].fieldKey}
													&nbsp;-&nbsp;
													{pricePlan?.pricePlanFields[6].fieldValue}
												</ListItem>
												<ListItem>
													<ListIcon
														as={CheckCircleIcon}
														color="green.500"
													/>
													{pricePlan?.pricePlanFields[7].fieldKey}
													&nbsp;-&nbsp;
													{pricePlan?.pricePlanFields[7].fieldValue}
												</ListItem>
												<ListItem>
													<ListIcon
														as={CheckCircleIcon}
														color="green.500"
													/>
													{pricePlan?.pricePlanFields[8].fieldKey}
													&nbsp;-&nbsp;
													{pricePlan?.pricePlanFields[8].fieldValue}
												</ListItem>
												<ListItem>
													<ListIcon
														as={CheckCircleIcon}
														color="green.500"
													/>
													{pricePlan?.pricePlanFields[9].fieldKey}
													&nbsp;-&nbsp;
													{pricePlan?.pricePlanFields[9].fieldValue}
												</ListItem>
												<ListItem>
													<ListIcon
														as={CheckCircleIcon}
														color="green.500"
													/>
													{pricePlan?.pricePlanFields[10].fieldKey}
													&nbsp;-&nbsp;
													{pricePlan?.pricePlanFields[10].fieldValue}
												</ListItem>
												<ListItem>
													<ListIcon
														as={CheckCircleIcon}
														color="green.500"
													/>
													{pricePlan?.pricePlanFields[11].fieldKey}
													&nbsp;-&nbsp;
													{pricePlan?.pricePlanFields[11].fieldValue}
												</ListItem>
												{pricePlan?.pricePlanFields[12]?.fieldKey ? (
													<ListItem>
														<ListIcon
															as={CheckCircleIcon}
															color="green.500"
														/>
														{pricePlan?.pricePlanFields[12]?.fieldKey}
														&nbsp;-&nbsp;
														{pricePlan?.pricePlanFields[12]?.fieldValue}
													</ListItem>
												) : null}
											</List>
										</VStack>
									</PriceWrapper>
								))}
							</Stack>
						</Box>
						<Flex flexDirection={'column'}>
							<Flex
								flexDirection={['column-reverse', 'row']}
								justifyContent={'space-around'}
							>
								<Box maxW={96} marginTop={[10, 0]}>
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
											$1,500/month or 2.5$ of total price per successful bid -
											pay per sale (PPS)
										</Text>
									</HStack>
									<Text marginTop={6}>
										App users in iOS or Android use the app for free. You can
										find the app on the App Store (iOS) or Google Play Store
										(Android)
									</Text>
								</Box>
							</Flex>
						</Flex>
						<Box marginTop={20}>
							<FAQ />
						</Box>
					</Container>
				</>
			)}
		</>
	);
};

const PriceWrapper = ({ children }: { children: ReactNode }) => {
	return (
		<Box mb={4} shadow="base" borderWidth={'1px'} rounded={'md'}>
			{children}
		</Box>
	);
};
