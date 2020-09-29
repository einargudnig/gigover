import React from 'react';
import styled from 'styled-components';

interface CommentProps {
	author: string;
	date: Date;
	comment: string;
}

const CommentStyled = styled.div`
	p:first-child {
		strong {
			display: inline-block;
			font-size: 16px;
			color: #000;
			margin-right: ${(props) => props.theme.padding(1.5)};
		}
	}

	p:last-child {
		margin-bottom: ${(props) => props.theme.padding(3)};
	}
`;

export const Comment = ({ author, date, comment }: CommentProps): JSX.Element => (
	<CommentStyled>
		<p>
			<strong>{author}</strong>
			<small>{date.toString()}</small>
		</p>
		<p>{comment}</p>
	</CommentStyled>
);
