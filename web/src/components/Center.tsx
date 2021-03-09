import React from 'react';
import styled from 'styled-components';

const CenterStyled = styled.div`
	display: flex;
	flex: 1;
	width: 100%;
	height: 100%;
	align-items: center;
	justify-content: center;
`;

interface CenterProps {
	children: React.ReactNode;
}

export const Center = ({ children }: CenterProps) => {
	return <CenterStyled>{children}</CenterStyled>;
};
