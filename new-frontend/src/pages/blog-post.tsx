import { Box, Container, Flex, Image, Heading, Text } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import { useBlogPost } from '../queries/useBlogPost';
import { Theme, ColorKey } from '../theme';
import { Center } from '../components/center';
import { LoadingSpinner } from '../components/loading-spinner';

interface PageBlockWithBackgroundProps {
	imageUrl: string;
	children?: React.ReactNode;
}

interface PageBlockProps {
	color?: ColorKey;
	children?: React.ReactNode;
}

const PageBlockImage = ({ imageUrl }: { imageUrl: string }) => {
	return (
		<Box
			position="absolute"
			width="100%"
			right={0}
			top={0}
			zIndex={1}
			height="100%"
			_before={{
				bgGradient: 'linear(90deg, rgba(250,228,77,1) 0%, rgba(250,228,77,0) 100%)',
				width: '40%',
				opacity: '0.7',
				zIndex: 2,
				position: 'absolute',
				content: '""',
				display: 'block',
				height: '100%',
				top: 0,
				right: 0
			}}
		>
			<Image
				position="absolute"
				top={0}
				right={0}
				height="100%"
				width="40%"
				zIndex={1}
				objectFit="cover"
				src={imageUrl}
				opacity={0.5}
			/>
		</Box>
	);
};

const BlogArticle = ({ contentHtml }: { contentHtml: string }) => {
	return (
		<Container maxW="90%" color="#747474">
			<Box dangerouslySetInnerHTML={{ __html: contentHtml }} />
		</Container>
	);
};

const PageBlockWithBackground = ({ imageUrl, children }: PageBlockWithBackgroundProps) => (
	<Box
		bg={Theme.backgroundColors.yellow}
		color={Theme.fontColors.bg.yellow}
		position="relative"
		p={6}
	>
		<PageBlockImage imageUrl={imageUrl} />
		<Container maxW="1343px" m="0 auto" position="relative" zIndex={3}>
			{children}
		</Container>
	</Box>
);

const PageBlock = ({ children, color = 'black' }: PageBlockProps) => (
	<Box
		bg={Theme.backgroundColors[color]}
		color={Theme.fontColors.bg[color]}
		position="relative"
		p={6}
	>
		<Container maxW="1343px" m="0 auto" position="relative" zIndex={3}>
			{children}
		</Container>
	</Box>
);

export const BlogPost = () => {
	const { id, slug } = useParams<{ id?: string; slug?: string }>();
	const { data: blog, isLoading, isError } = useBlogPost({ id: id || '', slug: slug || '' });

	return (
		<>
			{isLoading ? (
				<Center>
					<LoadingSpinner />
				</Center>
			) : (
				<>
					{isError ? (
						<Text>Error!</Text>
					) : (
						<Box>
							{blog && (
								<>
									<PageBlockWithBackground imageUrl={blog.blog.image.url}>
										<Heading mt={10} mb={-2.5} size="md">
											By the Gigover Team
										</Heading>
										<Heading maxW="70%" size="2xl">
											{blog.blog.title}
										</Heading>
									</PageBlockWithBackground>
									<PageBlock color="white">
										<BlogArticle contentHtml={blog.blog.content.html} />
									</PageBlock>
								</>
							)}
						</Box>
					)}
				</>
			)}
		</>
	);
};
