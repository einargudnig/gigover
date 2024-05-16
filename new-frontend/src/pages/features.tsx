import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { Text, VStack, Image, Box, Flex, Spacer } from '@chakra-ui/react';
import { usePage } from '../queries/usePage';
import { LoadingSpinner } from '../components/loading-spinner';
import { Center } from '../components/center';
import { FeaturesSection } from '../components/features-section';
import { FAQ } from '../components/faq';

export const Features = (): JSX.Element => {
	const location = useLocation();

	const variable = {
		slug: location.pathname.split('/')[1]
	};
	const { data, isLoading } = usePage(variable);

	return (
		<>
			<Helmet>
				<title>Gigover | Features</title>
				<link rel="canonical" href="https://www.gigover.com/features" />
			</Helmet>
			{isLoading ? (
				<Center>
					<LoadingSpinner />
				</Center>
			) : (
				<>
					{/* <Box marginTop={10}>
						<Flex flexDirection={['column', 'row']}>
							<Box>
								<Flex
									flexDirection={'column'}
									justifyContent={'center'}
									textAlign={'center'}
								>
									<Heading>
										Managing your work has never been easier, faster or more
										efficient
									</Heading>
									<Text>Lorem ipsum</Text>
									<Button size={'md'}>Start a free trial</Button>
								</Flex>
							</Box>
							<Spacer />
							<Box marginLeft={[0, 10]}>
								<Image
									src={'https://placehold.co/400x200'}
									alt="Project dashboard"
									width={['400px', '800px']}
									height={['200px', '400px']}
									rounded={'md'}
								/>
							</Box>
						</Flex>
					</Box> */}
					<Box paddingY={[0, 10]}>
						<Box marginY={10} p={4}>
							<VStack>
								<FeaturesSection />
							</VStack>
						</Box>
						{data?.page.pageBlocks.slice(1).map((block) => (
							<React.Fragment key={block.id}>
								<Flex flexDir={['column-reverse', 'row']}>
									<Box marginTop={10}>
										<Image
											src={block.image?.url}
											alt="Project dashboard"
											width={['400px', '700px']}
											height={['200px', '400px']}
											rounded={'md'}
										/>
									</Box>
									<Spacer />
									<Box
										marginTop={20}
										textAlign={'center'}
										width={['100%', '40%']}
									>
										<VStack>
											<Text fontSize={'2xl'} as="b">
												{block.heading}
											</Text>
											<Text>{block.content}</Text>
										</VStack>
									</Box>
								</Flex>
							</React.Fragment>
						))}
						<Box marginTop={20}>
							<FAQ />
						</Box>
					</Box>
				</>
			)}
		</>
	);
};
