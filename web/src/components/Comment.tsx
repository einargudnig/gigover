import React from 'react';
import styled from 'styled-components';
import { formatDate } from '../utils/StringUtils';
import { ProjectImage } from '../models/ProjectImage';
import { Box } from '@chakra-ui/react';
import { GetFileLink } from '../pages/Files/components/File';
import { Link } from 'react-router-dom';

const CommentRegex = /@\[(.*?)\]\((?:.*?)\)/g;

interface CommentProps {
	author: string;
	date: Date;
	comment: string;
	imageId: number;
	images?: ProjectImage[];
}

const CommentStyled = styled.div`
	p:first-child {
		display: flex;
		justify-content: space-between;

		strong {
			font-weight: normal;
			display: inline-block;
			font-size: 0.6875rem;
			color: #000;
			margin-right: ${(props) => props.theme.padding(1.5)};
		}
	}

	p:last-child {
		background: #e4e6eb;
		color: #000;
		padding: 3px 6px;
		font-size: 14px;
		border-radius: 6px;
		margin-top: ${(props) => props.theme.padding(1)};
		margin-bottom: ${(props) => props.theme.padding(3)};

		span.usertag {
			border-bottom: 1px solid #fae44d;
			display: inline-block;
		}
	}
`;

export const Comment = ({
	author,
	date,
	comment,
	imageId,
	images = []
}: CommentProps): JSX.Element | null => {
	// No comment......
	if (comment.trim().length < 1 && imageId === 0) {
		return null;
	}

	const commentText = comment.replace(
		CommentRegex,
		"<span class='usertag' style='font-weight: bold; color: #000'>$1</span>"
	);

	const foundImage = images?.find((i) => i.imageId === imageId);

	return (
		<>
			<CommentStyled>
				<p>
					<strong>{author}</strong>
					<small>{formatDate(date)}</small>
				</p>
				{foundImage && (
					<div>
						<Link to={GetFileLink(foundImage)}>
							<Box
								mt={2}
								mb={-2}
								borderRadius={8}
								overflow={'hidden'}
								display={'inline-block'}
							>
								<img
									src={foundImage.previewImage}
									alt="Uploaded Image"
									style={{ maxHeight: 120, maxWidth: 120, objectFit: 'contain' }}
								/>
							</Box>
						</Link>
					</div>
				)}
				{comment.trim().length > 0 ? (
					<p
						dangerouslySetInnerHTML={{ __html: commentText }}
						style={{ display: 'inline-block' }}
					/>
				) : (
					<React.Fragment />
				)}
			</CommentStyled>
		</>
	);
};
