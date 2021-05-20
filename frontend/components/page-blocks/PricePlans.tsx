import React, { useMemo } from 'react';
import styled from 'styled-components';
import { PricePlan } from '../../models/Page';
import { PageBlock } from '../PageContainer';
import { Div } from '../Div';
import {useVerify} from '../../queries/useVerify';
import {Button} from '../Button';

interface PricePlansProps {
	pricePlans: PricePlan[];
}

const PricePlanCardContainer = styled.div`
	height: 210px;
	padding: ${props => props.theme.padding(4)};
	width: 100%;
	margin-bottom: ${props => props.theme.padding(3)};
`;

const PricePlanCard = styled(PricePlanCardContainer)`
	background: ${(props) => props.theme.colors.gray['100']};
	border-radius: ${(props) => props.theme.borderRadius};
	border-bottom: 4px inset #fae44d;
	text-align: center;
	
	h1 {
		span {
			font-weight: 400;
			font-size: 16px;
		}
	}
`;

const PricePlanField = styled.p`
	font-size: 18px;
	font-weight: 300;
	line-height: 42px;
`;

const PricePlanTitles = styled.div`
	margin: ${props => props.theme.padding(3)};
	flex: 1 0;
`;

const PricePlanColumn = styled.div`
	margin: ${props => props.theme.padding(3)};
	flex: 0 0 30%;
`;

export const PricePlans = ({ pricePlans }: PricePlansProps): JSX.Element => {
	const { openProjects } = useVerify();

	const allKeys = useMemo(() => {
		const keys = pricePlans.flatMap((p) => p.pricePlanFields.map((f) => f.fieldKey));

		const set = new Set(keys);
		let it = set.values();
		return Array.from(it);
	}, [pricePlans]);

	return (
		<PageBlock color={'white'}>
			<Div flex justify={'space-between'} align={'flex-start'}>
				<PricePlanTitles>
					<PricePlanCardContainer />
					{allKeys.map((k) => (
						<PricePlanField key={k}>{k}</PricePlanField>
					))}
				</PricePlanTitles>
				{pricePlans.map((p, index) => (
					<PricePlanColumn key={index}>
						<PricePlanCard>
							<h3>{p.name}</h3>
							<p>{p.description}</p>
							<h1><span>$</span>{p.monthlyPrice}<span>/month</span></h1>
						</PricePlanCard>
						<div style={{ textAlign: 'center' }}>
							{p.pricePlanFields.map((f, idx) => (
								<PricePlanField key={idx}>{f.fieldValue}</PricePlanField>
							))}
						</div>
						<Div flex justify={'center'} style={{ marginTop: 24 }}>
							<Button onClick={() => openProjects()}>
								Sign up!
							</Button>
						</Div>
					</PricePlanColumn>
				))}
			</Div>
		</PageBlock>
	);
};
