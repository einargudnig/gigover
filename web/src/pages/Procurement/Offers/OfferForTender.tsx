import React from 'react';
import styled from 'styled-components';
import { Button, HStack, VStack, Text } from '@chakra-ui/react';
import { Page } from '../../../components/Page';

const Container = styled.div`
	flex: 1 0;
	height: 100%;
	padding: ${(props) => props.theme.padding(3)};
	overflow-y: auto;
`;

export const OfferForTender = (): JSX.Element => {
	return (
		<>
			<Page
				title={'Procurement'}
				contentPadding={false}
				actions={
					<>
						{/* by adding addTender as a parameter to the setModalContext I'm  `selecting` what modal to use. */}
						<Button>New Procurement</Button>
					</>
				}
			>
				<VStack style={{ height: '100%' }}>
					<HStack style={{ flex: 1, height: '100%', width: '100%' }}>
						<Container>
							<Text>This is the page where all Offers for this tenderId</Text>
						</Container>
					</HStack>
				</VStack>
			</Page>
		</>
	);
};
