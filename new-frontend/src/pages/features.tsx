import React from 'react';
import { useLocation } from 'react-router-dom';
import { Text, VStack, Image, Box, Flex, Spacer, Heading } from '@chakra-ui/react';
import { usePage } from '../queries/usePage';
import { LoadingSpinner } from '../components/loading-spinner';
import { Center } from '../components/center';

export const Features = (): JSX.Element => {
	const location = useLocation();

	const variable = {
		slug: location.pathname.split('/')[1]
	};
	const { data, isLoading } = usePage(variable);

	return (
		<>
			<Heading as="h1" textAlign={'center'}>
				{data?.page.name}
			</Heading>
			{isLoading ? (
				<Center>
					<LoadingSpinner />
				</Center>
			) : (
				<>
					<Box marginTop={10}>
						{data?.page.pageBlocks.slice(1).map((block) => (
							<React.Fragment key={block.id}>
								<Flex flexDir={['column-reverse', 'row']}>
									<Box marginTop={10}>
										<Image
											src={block.image?.url}
											alt="Project dashboard"
											width={['400px', '800px']}
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
					</Box>
				</>
			)}
		</>
	);
};
