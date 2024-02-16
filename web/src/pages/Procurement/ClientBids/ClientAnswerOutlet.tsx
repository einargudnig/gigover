import React from 'react';
import styled from 'styled-components';
import { Box, Flex, HStack, Text, VStack } from '@chakra-ui/react';

import { Outlet } from 'react-router-dom';

const Container = styled.div`
	flex: 1 0;
	height: 100%;
	overflow-y: auto;
`;

export const ClientAnswerOutlet = (): JSX.Element => {
	return (
		<>
			<Flex justifyContent={'start'} alignItems={'center'} mb={'2'}>
				<Box>
					<Text>This tab is used to answer bids that you receive</Text>
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
