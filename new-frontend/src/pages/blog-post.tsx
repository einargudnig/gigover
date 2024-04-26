import { Text } from '@chakra-ui/react';
import { Blog } from '../queries/useBlogPosts';

export interface BlogPostProps {
	blog: Blog | null;
}

export const BlogPost = ({ blog }: BlogPostProps): JSX.Element => {
	if (blog === null) {
		throw new Error('Blog post not found');
	}

	return (
		<>
			<Text></Text>
		</>
	);
};
