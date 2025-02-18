import { Box, Button, Flex } from '@chakra-ui/react';
import { NewTenderCreate } from './tabs/NewTenderCreate';
import { useState } from 'react';
import { NewTenderList } from './tabs/NewTenderList';

export const ProcurementHome = (): JSX.Element => {
	const [showCreateTender, setShowCreateTender] = useState(false);

	return (
		<Box p={3}>
			<Flex marginTop={2} justifyContent="end">
				<Box>
					{showCreateTender && (
						<Button
							variant="outline"
							colorScheme="gray"
							onClick={() => setShowCreateTender(false)}
						>
							Tender list
						</Button>
					)}
					<Button ml={2} onClick={() => setShowCreateTender(true)}>
						New tender
					</Button>
				</Box>
			</Flex>
			<>{showCreateTender ? <NewTenderCreate /> : <NewTenderList />}</>
		</Box>
	);
};
