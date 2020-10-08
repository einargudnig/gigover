import React from 'react';
import styled from 'styled-components';
import { Page } from '../components/Page';

const OrganizeStyled = styled.div``;

export const Organize = (): JSX.Element => {
	return (
		<Page title={'Organize'}>
			<OrganizeStyled>
				<h1>Organize</h1>
			</OrganizeStyled>
		</Page>
	);
};
