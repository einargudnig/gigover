import { Box, Button } from '@chakra-ui/react';
import { useContext } from 'react';
import { Page } from '../components/Page';
import { InputWrapper } from '../components/forms/Input';
import { FirebaseContext } from '../firebase/FirebaseContext';

export const Settings = (): JSX.Element => {
	const firebase = useContext(FirebaseContext);
	return (
		<Page title={'Settings'}>
			<div>
				<Box marginBottom={4}>Gigover Project Manager v1.5</Box>
				<InputWrapper>
					<Button onClick={() => firebase.signOut()}>Sign out</Button>
				</InputWrapper>
			</div>
		</Page>
	);
};
