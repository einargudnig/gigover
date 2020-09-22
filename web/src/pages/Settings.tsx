import React from 'react';
import styled from 'styled-components';
import { Page } from '../components/Page';

interface SettingsProps {}

const SettingsStyled = styled.div``;

export const Settings = ({}: SettingsProps): JSX.Element => {
	return (
		<Page title={'Settings'}>
			<SettingsStyled>
				<h1>Settings</h1>
			</SettingsStyled>
		</Page>
	);
};
