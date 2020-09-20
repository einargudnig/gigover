import React from 'react';
import styled from 'styled-components';

interface DashboardProps {
}

const DashboardStyled = styled.div``;

export const Dashboard = ({}: DashboardProps): JSX.Element => {
    return (
        <DashboardStyled>
            <h1>Dashboard</h1>
        </DashboardStyled>
    );
};

