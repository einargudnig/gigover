import React from 'react';
import { PageBlock } from '../../models/PageBlock';
import { Div } from '../Div';
import theme from '../../styles/theme';
import { PageId } from '../../models/Page';
import styled from 'styled-components';

interface VideoProps {
	pageId: PageId;
	pageBlock: PageBlock;
}

const regExp = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;

const validateYouTubeUrl = (url: string): string | false => {
	if (url) {
		if (url.match(regExp)) {
			const matches = url.match(regExp);
			return matches[1];
		}
	}
	return false;
};

const YoutubeVideo = styled.div`
	overflow: hidden;
	padding-bottom: 35%;
	position: relative;
	height: 0;
	margin-top: ${props => props.theme.padding(4)};
	width: 800px;
	border-radius: 50px;

	iframe {
		left: 0;
		top: 0;
		height: 100%;
		width: 100%;
		position: absolute;
	}
`;

export const Video = ({ pageId, pageBlock }: VideoProps): JSX.Element | null => {
	const result = validateYouTubeUrl(pageBlock.content);

	// Only allow valid Youtube URLs
	if (result === false) {
		return null;
	}

	return (
		<Div
			flex={'column'}
			justify={'space-between'}
			align={'center'}
			style={{ padding: theme.padding(4) }}
		>
			<h2>{pageBlock.heading}</h2>
			<YoutubeVideo>
				<iframe
					width="853"
					height="480"
					src={`https://www.youtube.com/embed/${result as string}`}
					frameBorder="0"
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
					allowFullScreen
					title="A gigover video"
				/>
			</YoutubeVideo>
		</Div>
	);
};
