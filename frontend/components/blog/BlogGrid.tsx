import React from 'react';
import styled from 'styled-components';
import { Blog } from '../../queries/useBlogPosts';
import Link from 'next/link';
import { BlogPost } from './BlogPost';

const BlogGridStyled = styled.div`
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	grid-gap: ${(props) => props.theme.padding(3)};

	@media screen and (max-width: 1400px) {
		grid-template-columns: repeat(3, 1fr);
		grid-gap: ${(props) => props.theme.padding(2.5)};
	}

	@media screen and (max-width: 1080px) {
		grid-template-columns: repeat(2, 1fr);
		grid-gap: ${(props) => props.theme.padding(2)};
	}

	@media screen and (max-width: 768px) {
		grid-template-columns: repeat(1, 1fr);
		grid-gap: ${(props) => props.theme.padding(2)};
	}
`;

export interface BlogGridProps {
	blogs: Blog[];
}

export const BlogGrid = ({ blogs }: BlogGridProps): JSX.Element => {
	return (
		<BlogGridStyled>
			{blogs.map((b) => (
				<div key={b.id}>
					<Link href={`/blog/${b.id}/${b.slug}`}>
						<a>
							<BlogPost blog={b} />
						</a>
					</Link>
				</div>
			))}
		</BlogGridStyled>
	);
};
