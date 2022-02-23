import React from 'react';
import styled from 'styled-components';
import { formatDate } from '../utils/StringUtils';

const CommentRegex = /@\[(.*?)\]\((?:.*?)\)/g;

interface CommentProps {
	author: string;
	date: Date;
	comment: string;
}

const CommentStyled = styled.div`
	p:first-child {
		display: flex;
		justify-content: space-between;

		strong {
			display: inline-block;
			font-size: 16px;
			color: #000;
			margin-right: ${(props) => props.theme.padding(1.5)};
		}
	}

	p:last-child {
		background: #fbfbfb;
		color: #333;
		padding: 3px 6px;
		font-size: 13px;
		border-radius: 6px;
		margin-top: ${(props) => props.theme.padding(1)};
		margin-bottom: ${(props) => props.theme.padding(3)};

		span.usertag {
			border-bottom: 1px solid #fae44d;
			display: inline-block;
		}
	}
`;

export const Comment = ({ author, date, comment }: CommentProps): JSX.Element | null => {
	if (comment.trim().length < 1) {
		return null;
	}

	const commentText = comment.replace(
		CommentRegex,
		"<span class='usertag' style='font-weight: bold; color: #000'>$1</span>"
	);

	return (
		<CommentStyled>
			<p>
				<strong>{author}</strong>
				<small>{formatDate(date)}</small>
			</p>
			<p dangerouslySetInnerHTML={{ __html: commentText }} />
		</CommentStyled>
	);
};
