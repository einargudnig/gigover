import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { FirebaseContext } from '../firebase/FirebaseContext';
import { Firebase } from '../firebase/firebase';
import { GigoverLogo } from '../components/GigoverLogo';
import { GoogleIcon } from '../components/icons/GoogleIcon';
import { Center } from '@chakra-ui/react';
import { EmailIcon } from '@chakra-ui/icons';
import { LoginForm } from './LoginForm/LoginForm';

const LoginStyled = styled.div`
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	background: url(/img/loginbg.jpg) no-repeat;
	background-size: cover;
`;

const LoginWrapper = styled.div`
	margin: 24px;
`;

const LoginContainer = styled.div`
	margin-top: 40px;
	padding: 32px;
	max-width: 600px;
	background: #fff;
	border-radius: 4px;

	h3 {
		margin-top: 0;
	}

	p {
		max-width: 90%;
		line-height: 21px;
	}
`;

const LoginButton = styled.button`
	display: flex;
	cursor: pointer;
	width: 100%;
	padding: 12px 24px;
	align-items: center;
	border: 1px solid #e3e3e3;
	background: #000;
	color: #fff;
	border-radius: 4px;
	transition: all 0.2s linear;
	transform: scale(1);
	font-weight: bold;

	&:hover {
		transform: scale(1.025);
	}

	> svg {
		margin-right: 24px;
	}
`;

export const Login = (): JSX.Element => {
	const [loginForm, setLoginForm] = useState(false);
	const [loginError, setLoginError] = useState<string | null>(null);

	const [registrationForm, setRegistrationForm] = useState(false);
	const [registrationError, setRegistrationError] = useState<string | null>(null);

	const [loading, setLoading] = useState(false);
	const firebase: Firebase = useContext(FirebaseContext);

	const register = async (email: string, password: string) => {
		try {
			setRegistrationError(null);
			setLoading(true);
			await firebase.auth.createUserWithEmailAndPassword(email, password);
			setLoading(false);
		} catch (e) {
			console.error(e);
			setRegistrationError('Could not register user, this email may be registered already.');
			// Popup closed by user, or something failed..
			setLoading(false);
		}
	};

	const loginWithCredentials = async (email: string, password: string) => {
		// console.log('Email', email, 'Password', password);
		try {
			setLoginError(null);
			setLoading(true);
			await firebase.signInWithEmailAndPassword(email, password);
			setLoading(false);
		} catch (e) {
			console.error(e);
			setLoginError('Could not login user, invalid credentials');
			// Popup closed by user, or something failed..
			setLoading(false);
		}
	};

	const authenticate = async () => {
		try {
			setLoading(true);
			await firebase.signInWithGoogle();
			setLoading(false);
		} catch (e) {
			// Popup closed by user, or something failed..
			setLoading(false);
		}
	};

	return (
		<LoginStyled>
			<LoginWrapper>
				<GigoverLogo />
				<LoginContainer>
					<p>
						You can sign in to the Gigover Project Manager with your Google account or
						your own registered e-mail address.
					</p>
					<div>
						<div style={{ height: 24 }} />
						{loginForm ? (
							<>
								{loginError && (
									<div style={{ color: 'red', marginBottom: 16 }}>
										{loginError}
									</div>
								)}
								<LoginForm
									loading={loading}
									closeForm={() => setLoginForm(false)}
									buttonText={'Sign in'}
									onSubmit={loginWithCredentials}
								/>
							</>
						) : registrationForm ? (
							<>
								{registrationError && (
									<div style={{ color: 'red', marginBottom: 16 }}>
										{registrationError}
									</div>
								)}
								<LoginForm
									loading={loading}
									closeForm={() => setRegistrationForm(false)}
									buttonText={'Create account'}
									onSubmit={register}
								/>
							</>
						) : (
							<>
								<LoginButton onClick={() => setLoginForm(!loginForm)}>
									<EmailIcon boxSize={6} color={'#fff'} />
									{loading ? 'Loading' : 'Sign in with your email'}
								</LoginButton>
								<div style={{ height: 8 }} />
								<LoginButton onClick={authenticate}>
									<GoogleIcon size={24} />
									{loading ? 'Loading' : 'Sign in with Google'}
								</LoginButton>
								<Center p={4}>
									<span>or</span>
								</Center>
								<LoginButton onClick={() => setRegistrationForm(!registrationForm)}>
									Create new account
								</LoginButton>
							</>
						)}
					</div>
				</LoginContainer>
			</LoginWrapper>
		</LoginStyled>
	);
};
