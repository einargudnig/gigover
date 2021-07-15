import styled from 'styled-components';

export const BlogArticle = styled.div`
	max-width: 90%;
	color: #747474;

	p {
		line-height: 24px;
		margin-bottom: ${(props) => props.theme.padding(3)};
	}

	h1,
	h2,
	h3,
	h4,
	h5 {
		color: #000;
		margin-bottom: ${(props) => props.theme.padding(3)};
	}

	img {
		max-width: 80%;
		margin: ${(props) => props.theme.padding(3)} auto;
	}
`;
