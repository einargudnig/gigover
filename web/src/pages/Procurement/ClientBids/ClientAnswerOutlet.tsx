import React, { useContext } from 'react';
import styled from 'styled-components';
import { Box, Button, Flex, HStack, Spacer, Text, VStack } from '@chakra-ui/react';
import { PlusIcon } from '../../../components/icons/PlusIcon';
import { ModalContext } from '../../../context/ModalContext';
import { Outlet } from 'react-router-dom';

const Container = styled.div`
	flex: 1 0;
	height: 100%;
	overflow-y: auto;
`;

export const ClientAnswerOutlet = (): JSX.Element => {
	const [, setModalContext] = useContext(ModalContext);
	return (
		<>
			<Flex justifyContent={'center'} alignItems={'center'} mb={'2'}>
				<Box>
					<Text>This tab is used to answer bids that you receive</Text>
				</Box>
				<Spacer />
				<Box>
					<Button
						onClick={() => setModalContext({ addBid: { bid: undefined } })}
						leftIcon={<PlusIcon />}
					>
						your Bids
					</Button>
				</Box>
			</Flex>
			<VStack style={{ height: '100%' }}>
				<HStack style={{ flex: 1, height: '100%', width: '100%' }}>
					<Container>
						<Outlet />
					</Container>
				</HStack>
			</VStack>
		</>
	);
};
