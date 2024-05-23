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
	Button
} from '@chakra-ui/react';
import { CheckIcon } from '@chakra-ui/icons';
import { useLocation } from 'react-router-dom';
import { usePage } from '../queries/usePage';
import { PageBlock } from '../types';

interface Feature {
	id: number;
	description: string;
}

interface PricingTier {
	price: number;
	units: string;
	features: Feature[];
}

const pricingTiers: PricingTier[] = [
	{
		price: 0,
		units: '1-5',
		features: [
			{ id: 1, description: 'Properties' },
			{ id: 2, description: 'Tasks' },
			{ id: 3, description: 'File storage' },
			{ id: 4, description: 'Project managers' },
			{ id: 5, description: 'Messaging and notifications' },
			{ id: 6, description: 'Time clock and reports' }
		]
	},
	{
		price: 1.5,
		units: '6-100',
		features: [
			{ id: 1, description: 'Properties' },
			{ id: 2, description: 'Tasks' },
			{ id: 3, description: 'File storage' },
			{ id: 4, description: 'Project managers' },
			{ id: 5, description: 'Messaging and notifications' },
			{ id: 6, description: 'Time clock and reports' }
		]
	},
	{
		price: 1.0,
		units: '101-1000',
		features: [
			{ id: 1, description: 'Properties' },
			{ id: 2, description: 'Tasks' },
			{ id: 3, description: 'File storage' },
			{ id: 4, description: 'Project managers' },
			{ id: 5, description: 'Messaging and notifications' },
			{ id: 6, description: 'Time clock and reports' }
		]
	},
	{
		price: 0.8,
		units: '1000+',
		features: [
			{ id: 1, description: 'Properties' },
			{ id: 2, description: 'Tasks' },
			{ id: 3, description: 'File storage' },
			{ id: 4, description: 'Project managers' },
			{ id: 5, description: 'Messaging and notifications' },
			{ id: 6, description: 'Time clock and reports' }
		]
	}
];

export const NewPricing = (): JSX.Element => {
	const [value, setValue] = useState(0);
	const tier = pricingTiers[value];

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
							<Text fontSize={'18px'}>{tier.units}</Text>
							<Text fontSize={'18px'}>units</Text>
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
							<Text mb={4}>Price per unit:</Text>
							<Text fontSize="3xl" as="b">
								${tier.price}
							</Text>
							<Text>Scale your business, increase efficiency.. </Text>
							<Button marginTop={6}>Get started</Button>
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
									<ListItem>
										<HStack>
											<ListIcon as={CheckIcon} />
											<Text>Properties</Text>
										</HStack>
									</ListItem>
									<ListItem>
										<HStack>
											<ListIcon as={CheckIcon} />
											<Text>Tasks</Text>
										</HStack>
									</ListItem>
									<ListItem>
										<HStack>
											<ListIcon as={CheckIcon} />
											<Text>File storage</Text>
										</HStack>
									</ListItem>
									<ListItem>
										<HStack>
											<ListIcon as={CheckIcon} />
											<Text>Project managers</Text>
										</HStack>
									</ListItem>
									<ListItem>
										<HStack>
											<ListIcon as={CheckIcon} />
											<Text>Messaging and notifications</Text>
										</HStack>
									</ListItem>
									<ListItem>
										<HStack>
											<ListIcon as={CheckIcon} />
											<Text>Time clocks and reports</Text>
										</HStack>
									</ListItem>
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
			</Box>
		</>
	);
};
