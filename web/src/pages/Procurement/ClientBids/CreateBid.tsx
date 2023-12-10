import React, { useContext } from 'react';
import { Box, Button, Flex, Spacer, Text } from '@chakra-ui/react';
import { PlusIcon } from '../../../components/icons/PlusIcon';
import { ModalContext } from '../../../context/ModalContext';

export const CreateBid = (): JSX.Element => {
	const [, setModalContext] = useContext(ModalContext);
	return (
		<>
			<Flex justifyContent={'center'} alignItems={'center'} mb={'2'}>
				<Box>
					<Text>This tab is used to create bids that can be sent out to users</Text>
				</Box>
				<Spacer />
				<Box>
					<Button
						onClick={() => setModalContext({ addTender: { tender: undefined } })}
						leftIcon={<PlusIcon />}
					>
						Create new bid
					</Button>
				</Box>
			</Flex>
		</>
	);
};
