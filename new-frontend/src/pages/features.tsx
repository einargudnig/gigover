import { Grid, GridItem, Text } from '@chakra-ui/react';

export const Features = (): JSX.Element => {
	return (
		<>
			<Text fontSize="4xl">Features</Text>
			<Grid marginTop={10} templateColumns="repeat(6, 1fr)">
				<GridItem></GridItem>
			</Grid>
		</>
	);
};
