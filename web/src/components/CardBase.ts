import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Box } from "@chakra-ui/react";

export const CardBase = styled(Box)`
	max-width: 100%;
	border-radius: 12px;
	background: #fff;
	box-shadow: ${(props) => props.theme.boxShadow()};
	padding: 24px;
	transition: all 0.2s linear;
`;

export const CardBaseLink = styled(Link)`
	display: block;
	max-width: 100%;
	border-radius: 12px;
	background: #fff;
	box-shadow: ${(props) => props.theme.boxShadow()};
	padding: 24px;
	transition: all 0.2s linear;

	&:hover {
		box-shadow: 5px 10px 20px rgba(0, 0, 0, 0.1);
	}
`;
