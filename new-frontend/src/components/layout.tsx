import { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import { Navbar } from './navbar';
import { Footer } from './footer';

const Container = styled.div`
	width: 100vw;
	background-color: #ffffff;
`;

const ContentContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	margin: 0 36px;
`;

// const Grid = styled.div`
// 	display: grid;
// 	grid-template-columns: repeat(12, 1fr);
// 	grid-gap: 20px;
// 	margin: 0 36px;
// 	max-width: 1440px;

// 	// Target every direct child inside Grid
// 	> * {
// 		border-left: 1px dotted #000;
// 		border-right: 1px dotted #000;
// 	}
// `;

export const Layout = () => {
	return (
		<Container>
			<Navbar />
			<ContentContainer>
				<Outlet />
			</ContentContainer>
			<Footer />
		</Container>
	);
};
