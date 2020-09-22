import React from 'react';
import styled from 'styled-components';
import { Page } from '../components/Page';

interface UsersProps {
}

const UsersStyled = styled.div``;

export const Users = ({}: UsersProps): JSX.Element => {
    return (
		<Page title={'Users'}>
			<UsersStyled>
				<h1>Users</h1>
			</UsersStyled>
		</Page>
    );
};

