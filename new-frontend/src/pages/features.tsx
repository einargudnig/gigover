import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { Text, VStack, Image, Box, Flex, Spacer } from '@chakra-ui/react';
import { usePage } from '../queries/usePage';
import { LoadingSpinner } from '../components/loading-spinner';
import { Center } from '../components/center';
import { FeaturePageHero } from '../components/feature-page-hero';
import { FeaturesSection } from '../components/features-section';
import { FAQ } from '../components/faq';
import { Theme } from '../theme';
import { Cta } from '../components/cta';

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
					<Box paddingTop={[0, 10]}>
						<FeaturePageHero />
						<Box marginY={10} p={8} backgroundColor={'gray.200'}>
							<VStack>
								<FeaturesSection />
							</VStack>
						</Box>
						{data?.page.pageBlocks.slice(1).map((block, index) => (
							<Box key={block.id} paddingX={['10px', '165px']}>
								<Flex
									flexDirection={{
										base: 'column',
										md: index % 2 === 0 ? 'row-reverse' : 'row'
									}}
									paddingY={'36px'}
								>
									<Box marginTop={10}>
										<Image
											src={block.image?.url}
											alt="Project dashboard"
											width={['400px', '539px']}
											height={['200px', '301px']}
											rounded={'md'}
										/>
									</Box>
									<Spacer />
									<Box
										marginTop={20}
										textAlign={'center'}
										width={['100%', '446px']}
									>
										<VStack>
											<Text fontSize={'2xl'} as="b">
												{block.heading}
											</Text>
											<Text fontSize={'16px'}>{block.content}</Text>
										</VStack>
									</Box>
								</Flex>
							</Box>
						))}
						<Box marginTop={20} marginX={['10px', '165px']}>
							<FAQ />
						</Box>
						<Cta bgColor={Theme.backgroundColors.yellow} buttonColor="gray" />
					</Box>
				</>
			)}
		</>
	);
};
