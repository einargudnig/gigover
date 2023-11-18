import React, { useContext } from 'react';
import styled from 'styled-components';
import { Button, HStack, VStack } from '@chakra-ui/react';
import { Page } from '../../components/Page';
import { Outlet, NavLink } from 'react-router-dom';
import { PlusIcon } from '../../components/icons/PlusIcon';
import { ModalContext } from '../../context/ModalContext';

const Container = styled.div`
	flex: 1 0;
	height: 100%;
	padding: ${(props) => props.theme.padding(3)};
	overflow-y: auto;
`;

export const Procurement = (): JSX.Element => {
	const [, setModalContext] = useContext(ModalContext);

	return (
		<>
			<Page
				title={'Procurement'}
				contentPadding={false}
				actions={
					<>
						{/* by adding addTender as a parameter to the setModalContext I'm  `selecting` what modal to use. */}
						<Button>Client Answer</Button>
						<Button>Create Bid</Button>

						<NavLink to={'tender-offers'}>
							<Button>Offers Received</Button>
						</NavLink>
						<NavLink to={'bidder-offers'}>
							<Button>Submitted Bids</Button>
						</NavLink>
						<NavLink to={'bidder-tenders'}>
							<Button>Bid Invitations</Button>
						</NavLink>
						<Button
							onClick={() => setModalContext({ addTender: { tender: undefined } })}
							leftIcon={<PlusIcon />}
						>
							New Procurement
						</Button>
					</>
				}
			>
				<VStack style={{ height: '100%' }}>
					<HStack style={{ flex: 1, height: '100%', width: '100%' }}>
						<Container>
							<Outlet />
						</Container>
					</HStack>
				</VStack>
			</Page>
		</>
	);
};
