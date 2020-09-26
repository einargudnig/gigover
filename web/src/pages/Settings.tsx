import React, { useContext } from 'react';
import styled from 'styled-components';
import { Page } from '../components/Page';
import { FirebaseContext } from '../firebase/FirebaseContext';
import { Button } from '../components/forms/Button';

const SettingsStyled = styled.div``;

export const Settings = (): JSX.Element => {
	const firebase = useContext(FirebaseContext);

	return (
		<Page title={'Settings'}>
			<SettingsStyled>
				<h1>Settings</h1>
				<Button onClick={() => firebase.signOut()}>Sign out</Button>
			</SettingsStyled>
		</Page>
	);
};
