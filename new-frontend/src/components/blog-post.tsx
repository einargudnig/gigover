import { Box, Flex, Text, Image } from '@chakra-ui/react';
import { Blog } from '../queries/useBlogPosts';
import styled from 'styled-components';

export const BlogStyled = styled.div`
	width: 100%;
	height: 440px;
	background: #f6eada;
	display: flex;
	flex-direction: column;
	overflow: hidden;
	opacity: 1;
	transition: all 0.2s linear;

	&:hover {
		opacity: 0.9;
	}
`;

const BlogImageContainer = styled.div`
	background: #e5e5e5;
	width: 100%;
	height: 200px;

	img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
`;

const BlogTitle = styled.h3`
	line-height: 26px;
  padding: 24px
	padding-bottom: 0;
	margin-bottom: 16px;
`;

const BlogPreviewContainer = styled.div`
	flex: 1 1;
	padding: 24px;
	padding-top: 0;
`;

const BlogPreview = styled.p`
	display: -webkit-box;
	-webkit-line-clamp: 4;
	-webkit-box-orient: vertical;
	overflow: hidden;
	text-overflow: ellipsis;
	font-size: 14px;
	line-height: 22px;
`;

const BlogFooter = styled.div`
	display: flex;
	flex: 0 0 30px;
	color: #000;
	padding-left: 24px;
	padding-bottom: 24px;
	font-weight: bold;
	font-size: 12px;
	align-items: flex-end;
`;

export interface BlogPostProps {
	blog: Blog;
}

export const BlogPost = ({ blog }: BlogPostProps): JSX.Element => {
	console.log({ blog });
	return (
		<>
			{/* <BlogStyled>
				<BlogImageContainer>
					<img src={blog.image.url} alt={blog.title} />
				</BlogImageContainer>
				<BlogTitle>{blog.title}</BlogTitle>
				<BlogPreviewContainer>
					<BlogPreview>{blog.content.text.substr(0, 250)}</BlogPreview>
				</BlogPreviewContainer>
				<BlogFooter>By the Gigover Team</BlogFooter>
			</BlogStyled> */}
			<Box>
				<Flex flexDirection={'column'}>
					<Box>
						<Image src={blog.image.url} alt={blog.title} />
					</Box>
					<Box>
						<Text>{blog.title}</Text>
					</Box>
					<Box>
						<Text>{blog.content.text.substr(0, 250)}</Text>
					</Box>
					<Box>
						<Text>By the Gigover Team</Text>
					</Box>
				</Flex>
			</Box>
		</>
	);
};
