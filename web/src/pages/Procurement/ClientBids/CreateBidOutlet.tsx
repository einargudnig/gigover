import React from 'react';
import styled from 'styled-components';
import { HStack, VStack } from '@chakra-ui/react';

import { Outlet } from 'react-router-dom';

const Container = styled.div`
	flex: 1 0;
	height: 100%;
	overflow-y: auto;
`;

export const CreateBidOutlet = (): JSX.Element => {
	return (
		<VStack style={{ height: '100%' }}>
			<HStack style={{ flex: 1, height: '100%', width: '100%' }}>
				<Container>
					<Outlet />
				</Container>
			</HStack>
		</VStack>
	);
};
