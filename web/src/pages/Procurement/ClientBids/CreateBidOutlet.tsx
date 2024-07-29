import { Box, Flex, HStack, Text, VStack } from '@chakra-ui/react';
import styled from 'styled-components';

import { Outlet } from 'react-router-dom';

const Container = styled.div`
	flex: 1 0;
	height: 100%;
	overflow-y: auto;
`;

export const CreateBidOutlet = (): JSX.Element => {
	return (
		<>
			<Flex justifyContent={'start'} alignItems={'center'} mb={'2'}>
				<Box>
					<Text>🚧 this feature is still in development! 🚧</Text>
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
