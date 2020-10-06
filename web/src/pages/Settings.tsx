import React, { useContext } from 'react';
import styled from 'styled-components';
import { Page } from '../components/Page';
import { FirebaseContext } from '../firebase/FirebaseContext';
import { Button } from '../components/forms/Button';
import { InputWrapper } from '../components/forms/Input';
import { CardBase } from '../components/CardBase';

const SettingsStyled = styled.div``;

export const Settings = (): JSX.Element => {
	const firebase = useContext(FirebaseContext);

	return (
		<Page title={'Settings'}>
			<SettingsStyled>
				<CardBase style={{ marginBottom: 24 }}>Gigover Project Manager v1.0</CardBase>
				{/*<InputWrapper>*/}
				{/*	<Button onClick={() => setModalContext({ registered: false })}>*/}
				{/*		Update user details*/}
				{/*	</Button>*/}
				{/*</InputWrapper>*/}
				<InputWrapper>
					<Button onClick={() => firebase.signOut()}>Sign out</Button>
				</InputWrapper>
			</SettingsStyled>
		</Page>
	);
};
