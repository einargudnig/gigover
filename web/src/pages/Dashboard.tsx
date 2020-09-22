import React, { useContext } from 'react';
import styled from 'styled-components';
import { FirebaseContext } from '../firebase/FirebaseContext';
import { Page } from '../components/Page';

const DashboardStyled = styled.div``;

export const Dashboard = (): JSX.Element => {
	const firebase = useContext(FirebaseContext);

	return (
		<Page title={'Dashboard'}>
			<DashboardStyled>
				<h1>Dashboard</h1>
				<button onClick={() => firebase.signOut()}>Sign out</button>
			</DashboardStyled>
		</Page>
	);
};
