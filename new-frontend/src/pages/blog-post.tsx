import { Helmet } from 'react-helmet-async';
import { Box, Container, Image, Heading, Text } from '@chakra-ui/react';
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
			w="full"
			right={0}
			top={0}
			zIndex="docked"
			height="full"
			_before={{
				bgGradient: 'linear(to-r, rgba(250,228,77,1) 0%, rgba(250,228,77,0) 100%)',
				width: { base: 'full', md: '40%' },
				opacity: '0.7',
				zIndex: 'docked',
				position: 'absolute',
				content: '""',
				display: 'block',
				height: 'full',
				top: 0,
				right: 0
			}}
		>
			<Image
				position="absolute"
				top={0}
				right={0}
				height="full"
				width={{ base: 'full', md: '40%' }}
				zIndex="docked"
				src={imageUrl}
				objectFit="cover"
				opacity={0.5}
			/>
		</Box>
	);
};

const BlogArticle = ({ contentHtml }: { contentHtml: string }) => {
	return (
		<Container maxW={{ base: '100%', md: '90%' }} color="#747474">
			<Box dangerouslySetInnerHTML={{ __html: contentHtml }} />
		</Container>
	);
};

const PageBlockWithBackground = ({ imageUrl, children }: PageBlockWithBackgroundProps) => (
	<Box
		bg={Theme.backgroundColors.yellow}
		color={Theme.fontColors.bg.yellow}
		position="relative"
		p={{ base: 4, md: 6 }}
		marginTop={10}
	>
		<PageBlockImage imageUrl={imageUrl} />
		<Container maxW="full" position="relative" zIndex="docked">
			{children}
		</Container>
	</Box>
);

const PageBlock = ({ children, color = 'black' }: PageBlockProps) => (
	<Box
		bg={Theme.backgroundColors[color]}
		color={Theme.fontColors.bg[color]}
		position="relative"
		p={{ base: 4, md: 6 }}
	>
		<Container maxW="full" position="relative" zIndex="docked">
			{children}
		</Container>
	</Box>
);

export const BlogPost = () => {
	const { id, slug } = useParams<{ id?: string; slug?: string }>();
	const { data: blog, isLoading, isError } = useBlogPost({ id: id || '', slug: slug || '' });

	return (
		<>
			<Helmet>
				<title>Gigover | Blog</title>
				<link rel="canonical" href={`https://www.gigover.com/${id}/${slug}`} />
			</Helmet>
			{isLoading ? (
				<Center>
					<LoadingSpinner />
				</Center>
			) : (
				<Box paddingX={['10px', '240px']}>
					{isError ? (
						<Text>Error fetching blog post!</Text>
					) : (
						<>
							{blog && (
								<>
									<PageBlockWithBackground imageUrl={blog.blog.image.url}>
										<Heading mt={10} mb={-2.5} size="md">
											By the Gigover Team
										</Heading>
										<Heading maxW={{ base: '90%', md: '70%' }} size="2xl">
											{blog.blog.title}
										</Heading>
									</PageBlockWithBackground>
									<PageBlock color="white">
										<BlogArticle contentHtml={blog.blog.content.html} />
									</PageBlock>
								</>
							)}
						</>
					)}
				</Box>
			)}
		</>
	);
};
