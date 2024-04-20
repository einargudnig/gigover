import { ReactNode } from 'react';
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

const Grid = styled.div`
	display: grid;
	grid-template-columns: repeat(12, 1fr);
	grid-gap: 20px;
	margin: 0 36px;
	max-width: 1440px;

	// Target every direct child inside Grid
	> * {
		border-left: 1px dotted #000;
		border-right: 1px dotted #000;
	}
`;

type LayoutProps = {
	children: ReactNode;
};

export const Layout = ({ children }: LayoutProps) => {
	return (
		<Container>
			<Navbar />
			<ContentContainer>{children}</ContentContainer>
			<Footer />
		</Container>
	);
};
