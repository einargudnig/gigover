import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { BrowserRouterProps } from 'react-router-dom';
import { FirebaseContext } from '../firebase/FirebaseContext';
import { Firebase } from '../firebase/firebase';

const LoginStyled = styled.div``;

export const Login = (): JSX.Element => {
	const [loading, setLoading] = useState(false);
	const firebase: Firebase = useContext(FirebaseContext);

	const authenticate = async () => {
		setLoading(true);

		const authCredentials = await firebase.signInWithGoogle();

		console.log(authCredentials);
		setLoading(false);
	};

	return (
		<LoginStyled>
			<p>Loading: {loading ? 'loading' : 'false'}</p>
			<button onClick={authenticate}>Sign in with Google</button>
		</LoginStyled>
	);
};
