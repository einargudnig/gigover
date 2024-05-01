import { Link } from 'react-router-dom';
import { Text } from '@chakra-ui/react';
import { Blog, useBlogPosts } from '../queries/useBlogPosts';
import styled from 'styled-components';
import { BlogPost } from '../components/blog-post';
import { Center } from '../components/center';
import { LoadingSpinner } from '../components/loading-spinner';

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
	return (
		<>
			<Text fontSize={'4xl'} textAlign={'center'} marginBottom={10}>
				Blog
			</Text>
			{isLoading ? (
				<Center>
					<LoadingSpinner />
				</Center>
			) : (
				<BlogGridStyled>
					{blog?.blogs.map((b: Blog) => (
						<div key={b.id}>
							<Link to={`/blog/${b.id}/${b.slug}`}>
								<BlogPost blog={b} />
							</Link>
						</div>
					))}
				</BlogGridStyled>
			)}
		</>
	);
};
