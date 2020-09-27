import React from 'react';
import styled from 'styled-components';
import { GeneratedColor, useColorGenerator } from '../hooks/useColorGenerator';

const LabelStyled = styled.label<GeneratedColor>`
	padding: 4px 6px;
	font-size: 11px;
	font-weight: bold;
	background-color: ${(props) => props.backgroundColor};
	color: ${(props) => props.textColor};
	border-radius: 4px;
`;

interface LabelProps {
	text: string;
}

export const Label = ({ text }: LabelProps): JSX.Element => {
	const { backgroundColor, textColor } = useColorGenerator(text);

	return (
		<LabelStyled backgroundColor={backgroundColor} textColor={textColor}>
			{text}
		</LabelStyled>
	);
};
