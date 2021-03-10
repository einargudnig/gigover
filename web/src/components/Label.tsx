import React, { CSSProperties } from 'react';
import styled from 'styled-components';
import { GeneratedColor, colorGenerator } from '../hooks/colorGenerator';

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
	style?: CSSProperties;
}

export const Label = ({ text, ...props }: LabelProps): JSX.Element => {
	const { backgroundColor, textColor } = colorGenerator(text);

	return (
		<LabelStyled backgroundColor={backgroundColor} textColor={textColor} {...props}>
			{text}
		</LabelStyled>
	);
};
