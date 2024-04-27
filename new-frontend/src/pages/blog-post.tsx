import { useParams } from 'react-router-dom';
import { useBlogPost } from '../queries/useBlogPost';
import { Text } from '@chakra-ui/react';
import { Blog } from '../queries/useBlogPosts';

export const BlogPost = (): JSX.Element => {
	// const { id, slug } = useParams();
	// const { data } = useBlogPost({ id: id || '', slug: slug || '' });
	// console.log({ data });

	if (data === null) {
		throw new Error('Blog post not found');
	}

	return (
		<>
			<Text>Post</Text>
		</>
	);
};
