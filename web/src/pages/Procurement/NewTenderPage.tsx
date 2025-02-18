import { Box, Button, Flex } from '@chakra-ui/react';
import { NewTenderCreate } from './tabs/NewTenderCreate';

export function NewTenderPage() {
	return (
		<Box>
			<Flex justifyContent="end">
				<Button variant="outline" colorScheme="gray">
					New tender
				</Button>
			</Flex>
		</Box>
	);
}
