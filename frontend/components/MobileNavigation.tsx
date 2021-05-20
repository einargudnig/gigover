import React, { useEffect, useMemo, useState } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import { Page } from '../models/Page';
import { Nav } from './Navigation';
import { Logo } from './Logo';
import Link from 'next/link';

interface MobileNavigationProps {
	pages: Page[];
	onClose: () => void;
}

const MobileNavigationStyled = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	bottom: 0;
	width: 100%;
	height: 100%;
	background: rgba(0, 0, 0, 0.3);
	animation: fadeIn 0.2s linear forwards;

	@keyframes fadeIn {
		from {
			opacity: 0;
		}

		to {
			opacity: 1;
		}
	}
`;

const MobileNavigationContainer = styled.div`
	max-width: 70%;
	background: #000;
	box-shadow: 0 0 25px 15px rgba(0, 0, 0, 0.1);
	padding: ${(props) => props.theme.padding(3)};
	height: 100%;
	animation: slideInLeft 0.2s linear forwards;

	@keyframes slideInLeft {
		from {
			transform: translateX(-100%);
		}

		to {
			transform: translateX(0%);
		}
	}

	a {
		background-size: 0 0;
	}

	nav {
		a {
			display: block;
			color: #fff;
			font-size: 24px;
			line-height: 32px;
			padding: ${(props) => props.theme.padding(2, 0)};
		}
	}
`;

export const MobileNavigation = ({ pages, onClose }: MobileNavigationProps): JSX.Element | null => {
	// For SSR
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
		return () => setMounted(false);
	}, []);

	return mounted
		? ReactDOM.createPortal(
				<MobileNavigationStyled onClick={() => onClose()}>
					<MobileNavigationContainer>
						<Link href={'/'}>
							<a>
								<Logo color={'white'} />
							</a>
						</Link>
						<div style={{ height: 24 }} />
						<nav role={'main'}>
							<Nav pages={pages} />
						</nav>
					</MobileNavigationContainer>
				</MobileNavigationStyled>,
				document.getElementById('go-portal')
		  )
		: null;
};
