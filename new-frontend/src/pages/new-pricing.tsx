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
import { CheckCircleIcon, CheckIcon } from '@chakra-ui/icons';

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
							<SliderTrack>
								<SliderFilledTrack />
							</SliderTrack>
							<SliderThumb />
						</Slider>

						<HStack width={'200px'} marginLeft={4}>
							<Text>{tier.units}</Text>
							<Text>units</Text>
						</HStack>
					</Flex>
				</Box>

				<Box p={10} shadow="md" borderWidth="1px" borderRadius="md" marginBottom={8}>
					<Flex flexDir={'row'}>
						<Box>
							<Text mb={4}>Price per unit:</Text>
							<Text fontSize="3xl" as="b">
								${tier.price}
							</Text>
							<Text>
								Short description of the plan: scale your business, increase
								efficiency..{' '}
							</Text>
							<Button marginTop={6}>Get started</Button>
						</Box>
						<Spacer />
						<Box>
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
						</Box>
					</Flex>
				</Box>
			</Box>
		</>
	);
};
