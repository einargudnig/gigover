import { Button } from '@chakra-ui/react';
import { useContext } from 'react';
import { CardBase } from '../components/CardBase';
import { Page } from '../components/Page';
import { InputWrapper } from '../components/forms/Input';
import { FirebaseContext } from '../firebase/FirebaseContext';

export const Settings = (): JSX.Element => {
	const firebase = useContext(FirebaseContext);
	return (
		<Page title={'Settings'}>
			<div>
				<CardBase style={{ marginBottom: 24 }}>Gigover Project Manager v1.5</CardBase>
				<InputWrapper>
					<Button onClick={() => firebase.signOut()}>Sign out</Button>
				</InputWrapper>
			</div>
		</Page>
	);
};
