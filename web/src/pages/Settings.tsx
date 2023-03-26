import React, { useContext } from 'react';
import { Page } from '../components/Page';
import { FirebaseContext } from '../firebase/FirebaseContext';
import { InputWrapper } from '../components/forms/Input';
import { CardBase } from '../components/CardBase';
import { Button, Text } from '@chakra-ui/react';

export const Settings = (): JSX.Element => {
	const firebase = useContext(FirebaseContext);
	return (
		<Page title={'Settings'}>
			<div>
				<CardBase style={{ marginBottom: 24 }}>Gigover Project Manager v1.4</CardBase>
				<InputWrapper>
					<Button onClick={() => firebase.signOut()}>Sign out</Button>
				</InputWrapper>
			</div>
		</Page>
	);
};
