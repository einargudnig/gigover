import React from 'react';

export const CommentInputLabel = (): JSX.Element => {
	return (
		<small style={{ display: 'inline-block', marginTop: -24, fontStyle: 'italic' }}>
			Press ENTER to send your comment. You can tag workers by typing @ and then their name.
		</small>
	);
};
