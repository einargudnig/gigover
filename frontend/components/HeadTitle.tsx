import React from 'react';
import Head from 'next/head';

const PageTitlePrefix = 'Gigover | ';

export const PageTitle = (title: string, withPrefix = true) => {
	return withPrefix ? PageTitlePrefix + title : title;
};

export interface HeadTitleProps {
	title: string;
	description?: string;
	imageUrl?: string;
	withPrefix?: boolean;
}

export const HeadTitle = ({ title, description, imageUrl, withPrefix = true }: HeadTitleProps): JSX.Element => {
	const Title = PageTitle(title, withPrefix);

	return (
		<Head>
			<title>{Title}</title>
			<meta property="og:title" content={Title} />
			{description && <meta property="og:description" content={description} />}
			{imageUrl && <meta property="og:image" content={imageUrl} />}
		</Head>
	);
};
