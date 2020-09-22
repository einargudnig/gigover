import React, { useContext } from 'react';
import styled from 'styled-components';
import { FirebaseContext } from '../firebase/FirebaseContext';

interface DashboardProps {}

const DashboardStyled = styled.div``;

export const Dashboard = ({}: DashboardProps): JSX.Element => {
	const firebase = useContext(FirebaseContext);

	return (
		<DashboardStyled>
			<h1>Dashboard</h1>
			<button onClick={() => firebase.signOut()}>Sign out</button>
		</DashboardStyled>
	);
};
