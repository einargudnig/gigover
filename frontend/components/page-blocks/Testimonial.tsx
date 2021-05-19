import React from 'react';
import styled from 'styled-components';
import { PageId } from '../../models/Page';
import { PageBlock } from '../../models/PageBlock';
import { Div } from '../Div';

interface TestimonialProps {
	pageId: PageId;
	pageBlock: PageBlock;
}

const TestimonialStyled = styled(Div)`
	background-image: url('/quote.png');
	background-repeat: no-repeat;
	background-position: 0px 25px;
	background-size: initial;
	padding: ${(props) => props.theme.padding(8, 0)};
	
	> div:first-child {
		p {
			font-size: 24px;
			font-weight: 300;
			line-height: 32px;
		}
		
		h3 {
			margin-top: ${props => props.theme.padding(2)};
			
			&:nth-child(3) {
				font-weight: normal;
			}
		}
	}
`;

const ImageContainer = styled.div`
	flex: 0 0 35%;
	padding-left: ${props => props.theme.padding(4)};
	
	img {
		max-width: 100%;
	}
`;

export const Testimonial = ({ pageId, pageBlock }: TestimonialProps): JSX.Element => {
	const testimonial =
		pageBlock.testimonials[Math.floor(Math.random() * pageBlock.testimonials.length)];

	return (
		<TestimonialStyled flex justify={'space-between'} align={'center'}>
			<div>
				<p>{testimonial.testimonial}</p>
				<h3>{testimonial.name}</h3>
				<h3>{testimonial.company}</h3>
			</div>
			{testimonial.image && (
				<ImageContainer>
					<img src={testimonial.image.url} alt="" />
				</ImageContainer>
			)}
		</TestimonialStyled>
	);
};
