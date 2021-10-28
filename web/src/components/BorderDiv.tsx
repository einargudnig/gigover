import styled from 'styled-components';

export const BorderDiv = styled.div`
	border: 1px solid ${(props) => props.theme.colors.border};
	border-radius: ${(props) => props.theme.borderRadius};
`;
