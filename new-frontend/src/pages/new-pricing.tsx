import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import {
	Box,
	Slider,
	SliderTrack,
	SliderFilledTrack,
	SliderThumb,
	Text,
	Heading,
	HStack,
	Flex,
	Spacer,
	List,
	ListItem,
	ListIcon,
	Button,
	Table,
	TableContainer,
	Tbody,
	Td,
	Th,
	Thead,
	Tr
} from '@chakra-ui/react';
import { CheckIcon } from '@chakra-ui/icons';
import { Link, useLocation } from 'react-router-dom';
import { usePage } from '../queries/usePage';
import { PageBlock } from '../types';

interface Feature {
	id: number;
	description: string;
}

interface PricingTier {
	price: number;
	name: string;
	users: string;
	includedStorage: string;
	extraStorage: number;
	features: Feature[];
}

const pricingTiers: PricingTier[] = [
	{
		price: 0,
		name: 'Starter',
		users: '1-5',
		includedStorage: '250MB',
		extraStorage: 4,
		features: [
			{ id: 1, description: 'Properties' },
			{ id: 2, description: 'Tasks' },
			{ id: 3, description: 'File storage' },
			{ id: 4, description: 'Project managers' },
			{ id: 5, description: 'Messaging and notifications' },
			{ id: 6, description: 'Time clock and reports' },
			{ id: 7, description: '$4 adds to bill per user if user storage exceeds 250MB' }
		]
	},
	{
		price: 6.0,
		users: '6-100',
		name: 'Growth',
		includedStorage: '1GB',
		extraStorage: 0.25,
		features: [
			{ id: 1, description: 'Properties' },
			{ id: 2, description: 'Tasks' },
			{ id: 3, description: 'File storage' },
			{ id: 4, description: 'Project managers' },
			{ id: 5, description: 'Messaging and notifications' },
			{ id: 6, description: 'Time clock and reports' },
			{ id: 7, description: '$0.25 adds to bill per user if user storage exceeds 1GB' }
		]
	},
	{
		price: 5.0,
		name: 'Scale',
		users: '101-1000',
		includedStorage: '1GB',
		extraStorage: 0.25,
		features: [
			{ id: 1, description: 'Properties' },
			{ id: 2, description: 'Tasks' },
			{ id: 3, description: 'File storage' },
			{ id: 4, description: 'Project managers' },
			{ id: 5, description: 'Messaging and notifications' },
			{ id: 6, description: 'Time clock and reports' },
			{ id: 7, description: '$0.25 adds to bill per user if user storage exceeds 1GB' }
		]
	},
	{
		price: 4.0,
		users: '1000+',
		name: 'Enterprise',
		includedStorage: '1GB',
		extraStorage: 0.25,
		features: [
			{ id: 1, description: 'Properties' },
			{ id: 2, description: 'Tasks' },
			{ id: 3, description: 'File storage' },
			{ id: 4, description: 'Project managers' },
			{ id: 5, description: 'Messaging and notifications' },
			{ id: 6, description: 'Time clock and reports' },
			{ id: 7, description: '$0.25 adds to bill per user if user storage exceeds 1GB' }
		]
	}
];

export const NewPricing = (): JSX.Element => {
	const [value, setValue] = useState(0);
	const tier = pricingTiers[value];
	const { features } = tier;

	const location = useLocation();

	const variable = {
		slug: location.pathname.split('/')[1]
	};
	const { data } = usePage(variable);
	console.log({ data });

	return (
		<>
			<Helmet>
				<title>Gigover | Pricing</title>
				<link rel="canonical" href="https://www.gigover.com/pricing" />
			</Helmet>

			<Box>
				<Heading marginTop={10} marginBottom={6} textAlign={'center'}>
					Find the right plan for your team
				</Heading>

				<Box paddingY={10} paddingX={20}>
					<Flex alignItems={'center'}>
						<Slider
							value={value}
							onChange={setValue}
							max={pricingTiers.length - 1}
							step={1}
							mt={6}
							colorScheme="yellow"
						>
							<SliderTrack boxSize={3} rounded={'md'}>
								<SliderFilledTrack />
							</SliderTrack>
							<SliderThumb boxSize={6} border={'1px'} />
						</Slider>

						<HStack width={'200px'} marginLeft={5} marginBottom={-6}>
							<Text fontSize={'18px'}>{tier.users}</Text>
							<Text fontSize={'18px'}>users</Text>
						</HStack>
					</Flex>
				</Box>

				<Box
					p={10}
					shadow="md"
					borderWidth="1px"
					borderTop={'4px'}
					borderRadius="md"
					marginBottom={10}
				>
					<Flex flexDir={'row'}>
						<Box>
							<Heading mb={5} fontSize={'2xl'}>
								{tier.name}
							</Heading>
							<Text mb={4}>Price per seat:</Text>
							<Text fontSize="3xl" as="b">
								${tier.price}
							</Text>
							<Text>Scale your business, increase efficiency.. </Text>
							<Button marginTop={6}>
								<Link to="https://web.gigover.com/">Get started</Link>
							</Button>
						</Box>
						<Spacer />
						<Box>
							<Flex
								flexDir={'column'}
								alignItems={'center'}
								justifyContent={'flex-start'}
							>
								<Text marginBottom={4}>What's included:</Text>
								<List spacing={3} textAlign={'start'} px={12}>
									{features.map((feature) => (
										<ListItem key={feature.id}>
											<HStack>
												<ListIcon as={CheckIcon} />
												<Text>{feature.description}</Text>
											</HStack>
										</ListItem>
									))}
								</List>
							</Flex>
						</Box>
					</Flex>
				</Box>
				<Box marginTop={[10, 0]} marginBottom={8} textAlign={'center'}>
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

				<PricingTable />
			</Box>
		</>
	);
};

function PricingTable() {
	return (
		<Box padding={4} mt={4} mb={6}>
			<Flex justifyContent={'center'} alignItems={'center'}>
				<TableContainer>
					<Table size="lg">
						<Thead>
							<Tr>
								<Th>Plan Name</Th>
								<Th>Users</Th>
								<Th>Price/User</Th>
								<Th>Included Storage</Th>
								<Th>Extra Storage</Th>
							</Tr>
						</Thead>
						<Tbody>
							{pricingTiers.map((tier, index) => (
								<Tr>
									<Td key={index}>{tier.name}</Td>
									<Td>{tier.users}</Td>
									<Td>{tier.price === 0 ? 'Free' : `$${tier.price}`}</Td>
									<Td>{tier.includedStorage} per User</Td>
									<Td>${tier.extraStorage}/GB</Td>
								</Tr>
							))}
						</Tbody>
					</Table>
				</TableContainer>
			</Flex>
		</Box>
	);
}
