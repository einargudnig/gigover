import { Box, Flex, Text, Image } from '@chakra-ui/react';
import { Blog } from '../queries/useBlogPosts';

interface BlogPostProps {
	blog: Blog;
}

export const BlogPost = ({ blog }: BlogPostProps): JSX.Element => {
	return (
		<Box
			width="100%"
			rounded={'md'}
			height="440px"
			bg="#f6eada"
			display="flex"
			flexDirection="column"
			overflow="hidden"
			transition="all 0.2s linear"
			_hover={{
				opacity: 0.9
			}}
		>
			<Box bg="#e5e5e5" width="100%" height="200px">
				<Image
					src={blog.image.url}
					alt={blog.title}
					width="100%"
					height="100%"
					objectFit="cover"
				/>
			</Box>
			<Text
				as="h3"
				lineHeight="26px"
				paddingX="24px"
				paddingTop="24px"
				paddingBottom="0"
				marginBottom="16px"
			>
				{blog.title}
			</Text>
			<Flex flex="1 1" paddingX="24px" paddingTop="0">
				<Text
					display="-webkit-box"
					overflow="hidden"
					textOverflow="ellipsis"
					fontSize="14px"
					lineHeight="22px"
					css={{
						WebkitLineClamp: 4,
						WebkitBoxOrient: 'vertical'
					}}
				>
					{blog.content.text.substr(0, 250)}
				</Text>
			</Flex>
			<Flex
				flex="0 0 30px"
				alignItems="flex-end"
				paddingLeft="24px"
				paddingBottom="24px"
				color="#000"
				fontWeight="bold"
				fontSize="12px"
			>
				By the Gigover Team
			</Flex>
		</Box>
	);
};
