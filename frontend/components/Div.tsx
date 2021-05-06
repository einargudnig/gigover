import styled, { css } from 'styled-components';

interface DivProps {
	flex?: boolean;
	justify?: 'space-between' | 'flex-start' | 'flex-end';
	align?: 'center';
}

export const Div = styled.div<DivProps>`
	${(props) =>
		props.flex &&
		css`
			display: flex;
		`};

	${(props) =>
		props.justify &&
		css`
			justify-content: ${props.justify};
		`}

	${(props) =>
		props.align &&
		css`
			align-items: ${props.align};
		`}
`;
