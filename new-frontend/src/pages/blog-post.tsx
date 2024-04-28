import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useBlogPost } from '../queries/useBlogPost';
import { Text } from '@chakra-ui/react';
import { Theme, ColorKey } from '../theme';

interface PageBlockWithBackgroundProps {
	imageUrl: string;
	children?: React.ReactNode;
}

interface PageBlockProps {
	color?: ColorKey;
	children?: React.ReactNode;
}

export const ColorContainer = styled.div<{ backgroundColor: ColorKey }>`
	color: ${({ backgroundColor }) => Theme.fontColors.bg[backgroundColor]};
	background-color: ${({ backgroundColor }) => Theme.backgroundColors[backgroundColor]};
`;

const PageContainerStyled = styled(ColorContainer)`
	position: relative;
	padding: 24px;
`;

const PageBlockImage = styled.div<{ imageUrl: string }>`
	position: absolute;
	width: 100%;
	right: 0;
	top: 0;
	z-index: 1;
	height: 100%;

	.img {
		position: absolute;
		top: 0;
		right: 0;
		height: 100%;
		width: 40%;
		z-index: 1;
		opacity: 0.5;
		background-image: url(${(props) => props.imageUrl});
		background-position: 50% 25%;
		background-size: cover;
		background-repeat: no-repeat;
	}

	&:before {
		background: rgb(250, 228, 77);
		background: linear-gradient(90deg, rgba(250, 228, 77, 1) 0%, rgba(250, 228, 77, 0) 100%);
		width: 40%;
		opacity: 0.7;
		z-index: 2;
		position: absolute;
		content: '';
		display: block;
		height: 100%;
		top: 0;
		right: 0;
	}
`;

const Container = styled.div`
	position: relative;
	z-index: 3;
	max-width: 1343px;
	margin: 0 auto;
`;

const BlogArticle = styled.div`
	max-width: 90%;
	color: #747474;

	p {
		line-height: 24px;
		margin-bottom: 24px;
	}

	h1,
	h2,
	h3,
	h4,
	h5 {
		color: #000;
		margin-bottom: 24px;
	}

	img {
		max-width: 80%;
		margin: 24px auto;
	}
`;

export const BlogPost = (): JSX.Element => {
	const { id, slug } = useParams();
	const { data: blog, isLoading } = useBlogPost({ id: id || '', slug: slug || '' });
	console.log({ blog });

	if (blog === null) {
		throw new Error('Blog post not found');
	}

	if (isLoading) {
		return <div>Loading...</div>;
	}

	return (
		<>
			<Text>Post</Text>
			<PageBlockWithBackground imageUrl={blog!.blog.image.url}>
				<h4 style={{ marginTop: 60, marginBottom: -24 }}>By the Gigover Team</h4>
				<h1 style={{ maxWidth: '70%' }}>{blog!.blog.title}</h1>
			</PageBlockWithBackground>
			<PageBlock color={'white'}>
				<BlogArticle dangerouslySetInnerHTML={{ __html: blog!.blog.content.html }} />
			</PageBlock>
		</>
	);
};

const PageBlockWithBackground = ({
	imageUrl,
	children
}: PageBlockWithBackgroundProps): JSX.Element => (
	<PageContainerStyled backgroundColor={'yellow'}>
		<PageBlockImage imageUrl={imageUrl}>
			<div className={'img'} />
		</PageBlockImage>
		<Container>{children}</Container>
	</PageContainerStyled>
);

const PageBlock = ({ children, color = 'black' }: PageBlockProps): JSX.Element => (
	<PageContainerStyled backgroundColor={color}>
		<Container>{children}</Container>
	</PageContainerStyled>
);
