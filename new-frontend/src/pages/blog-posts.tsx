import { Link } from 'react-router-dom';
import { Text } from '@chakra-ui/react';
import { useBlogPosts } from '../queries/useBlogPosts';
import styled from 'styled-components';
import { BlogPost } from '../components/blog-post';

const BlogGridStyled = styled.div`
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	grid-gap: 1rem;

	@media screen and (max-width: 1400px) {
		grid-template-columns: repeat(3, 1fr);
		grid-gap: 1rem;
	}

	@media screen and (max-width: 1080px) {
		grid-template-columns: repeat(2, 1fr);
		grid-gap: 1rem;
	}

	@media screen and (max-width: 768px) {
		grid-template-columns: repeat(1, 1fr);
		grid-gap: 1rem;
	}
`;

export const BlogPosts = (): JSX.Element => {
	const { data: blog, isLoading } = useBlogPosts();
	console.log('in route', { blog });
	return (
		<>
			<Text fontSize="4xl" marginBottom={10}>
				Blog
			</Text>
			<BlogGridStyled>
				{blog?.blogs.map((b) => (
					<div key={b.id}>
						<Link to={`/blog/${b.id}/${b.slug}`}>
							<a>
								<BlogPost blog={b} />
							</a>
						</Link>
					</div>
				))}
			</BlogGridStyled>
		</>
	);
};
