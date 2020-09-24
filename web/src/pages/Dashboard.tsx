import React, { useContext, useEffect } from 'react';
import styled from 'styled-components';
import { FirebaseContext } from '../firebase/FirebaseContext';
import { Page } from '../components/Page';
import { useQuery } from 'react-query';
import { ApiService } from '../services/ApiService';

const DashboardStyled = styled.div``;

export const Dashboard = (): JSX.Element => {
	const firebase = useContext(FirebaseContext);

	useEffect(() =>{
		const getList = async () => {
			await ApiService.getProjectList();
		};

		getList();
	}, []);

	return (
		<Page title={'Dashboard'}>
			<DashboardStyled>
				<h1>Dashboard</h1>
				<button onClick={() => firebase.signOut()}>Sign out</button>
			</DashboardStyled>
		</Page>
	);
};
