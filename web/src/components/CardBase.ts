import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const CardBase = styled.div`
	max-width: 100%;
	border-radius: 12px;
	background: #fff;
	box-shadow: 5px 5px 25px rgba(0, 0, 0, 0.03);
	padding: 24px;
	transition: all 0.2s linear;
`;

export const CardBaseLink = styled(Link)`
	max-width: 100%;
	border-radius: 12px;
	background: #fff;
	box-shadow: 5px 5px 25px rgba(0, 0, 0, 0.03);
	padding: 24px;
	transition: all 0.2s linear;
`;
