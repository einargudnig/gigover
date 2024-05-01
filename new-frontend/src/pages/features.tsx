import React from 'react';
import { useLocation } from 'react-router-dom';
import { Grid, GridItem, Text, VStack, Image } from '@chakra-ui/react';
import { usePage } from '../queries/usePage';
import { LoadingSpinner } from '../components/loading-spinner';
import { Center } from '../components/center';

export const Features = (): JSX.Element => {
	const location = useLocation();

	const variable = {
		slug: location.pathname.split('/')[1]
	};
	const { data, isLoading } = usePage(variable);
	console.log({ data });

	return (
		<>
			<Text fontSize={'4xl'} textAlign={'center'}>
				{data?.page.name}
			</Text>
			{isLoading ? (
				<Center>
					<LoadingSpinner />
				</Center>
			) : (
				<>
					<Grid marginTop={10} templateColumns="repeat(6, 1fr)" gap={2}>
						{data?.page.pageBlocks.slice(1).map((block) => (
							<React.Fragment key={block.id}>
								<GridItem colSpan={4}>
									<Image
										src={block.image?.url}
										alt="Project dashboard"
										width={'800px'}
										height={'400px'}
									/>
								</GridItem>
								<GridItem colSpan={2} marginTop={20}>
									<VStack>
										<Text fontSize={'2xl'}>{block.heading}</Text>
										<Text>{block.content}</Text>
									</VStack>
								</GridItem>
							</React.Fragment>
						))}
					</Grid>
				</>
			)}
		</>
	);
};
