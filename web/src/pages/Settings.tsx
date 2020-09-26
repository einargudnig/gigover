import React, { useContext } from 'react';
import styled from 'styled-components';
import { Page } from '../components/Page';
import { FirebaseContext } from '../firebase/FirebaseContext';

const SettingsStyled = styled.div``;

export const Settings = (): JSX.Element => {
	const firebase = useContext(FirebaseContext);

	return (
		<Page title={'Settings'}>
			<SettingsStyled>
				<h1>Settings</h1>
				<button onClick={() => firebase.signOut()}>Sign out</button>
			</SettingsStyled>
		</Page>
	);
};
