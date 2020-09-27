import React, { useContext } from 'react';
import styled from 'styled-components';
import { Page } from '../components/Page';
import { FirebaseContext } from '../firebase/FirebaseContext';
import { Button } from '../components/forms/Button';
import { ModalContext } from '../context/ModalContext';
import { InputWrapper } from '../components/forms/Input';

const SettingsStyled = styled.div``;

export const Settings = (): JSX.Element => {
	const firebase = useContext(FirebaseContext);
	const [, setModalContext] = useContext(ModalContext);

	return (
		<Page title={'Settings'}>
			<SettingsStyled>
				<h1>Settings</h1>
				<InputWrapper>
					<Button onClick={() => setModalContext({ registered: false })}>
						Update user details
					</Button>
				</InputWrapper>
				<InputWrapper>
					<Button onClick={() => firebase.signOut()}>Sign out</Button>
				</InputWrapper>
			</SettingsStyled>
		</Page>
	);
};
