import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { FirebaseContext } from '../firebase/FirebaseContext';
import { Firebase } from '../firebase/firebase';
import { GigoverLogo } from '../components/GigoverLogo';
import { GoogleIcon } from '../components/icons/GoogleIcon';

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
	margin: 50px;
`;

const LoginContainer = styled.div`
	margin-top: 40px;
	padding: 32px;
	max-width: 420px;
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
	const [loading, setLoading] = useState(false);
	const firebase: Firebase = useContext(FirebaseContext);

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
					<h3>Sign in to manage your projects</h3>
					<p>You can sign in to the Gigover Project Manager with your Google account.</p>
					<div style={{ margin: 50 }}>
						<LoginButton onClick={authenticate}>
							<GoogleIcon size={24} />
							{loading ? 'Loading' : 'Sign in with Google'}
						</LoginButton>
					</div>
				</LoginContainer>
			</LoginWrapper>
		</LoginStyled>
	);
};
