import React from 'react';

export const CommentInputLabel = (): JSX.Element => {
	return (
		<small style={{ display: 'inline-block', marginTop: -24, fontStyle: 'italic' }}>
			You can drag and drop photos to the comment section. Press ENTER to send your comment.
			You can tag workers by typing @ and then their name.
		</small>
	);
};
