import { Box, Flex, Text } from '@chakra-ui/react';
import React from 'react';
import { Link } from 'react-router-dom';
import { ProjectImage } from '../models/ProjectImage';
import { GetFileLink } from '../pages/Files/components/File';
import { formatDate } from '../utils/StringUtils';

const CommentRegex = /@\[(.*?)\]\((?:.*?)\)/g;

interface CommentProps {
	author: string;
	date: Date;
	comment: string;
	imageId: number;
	images?: ProjectImage[];
}

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
		"<span class='usertag' style='font-weight: bold; color: #000; border-bottom: 1px solid #fae44d; display: inline-block;'>$1</span>"
	);

	const foundImage = images?.find((i) => i.imageId === imageId);

	return (
		<>
			<Box>
				<Flex justify="space-between">
					<Text as="strong" fontSize="0.6875rem" color="#000" mr={1.5 * 4}>
						{author}
					</Text>
					<Text as="small">{formatDate(date)}</Text>
				</Flex>
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
					<Box
						as="p"
						bg="#e4e6eb"
						color="#000"
						p="3px 6px"
						fontSize="14px"
						borderRadius="6px"
						mt={1 * 4}
						mb={3 * 4}
						dangerouslySetInnerHTML={{ __html: commentText }}
						display="inline-block"
					/>
				) : (
					<React.Fragment />
				)}
			</Box>
		</>
	);
};
