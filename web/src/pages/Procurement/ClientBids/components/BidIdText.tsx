import React from 'react';
import { Box, Text, Textarea } from '@chakra-ui/react';

export const BidIdText = (): JSX.Element => {
	// You can add notes when you publish the bid
	return (
		<>
			<Box marginTop={4}>
				<Text fontWeight={'bold'} fontSize={'xl'} marginBottom={2}>
					You can add notes with this Bid
				</Text>
				<Textarea
					placeholder="Notes..."
					variant="outline"
					size="lg"
					border="1px"
					rounded={5}
					p={1}
				/>
			</Box>
		</>
	);
};
