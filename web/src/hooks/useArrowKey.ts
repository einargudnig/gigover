import React, { useState } from 'react';

const useKeyPress = function (targetKey, onPress) {
	const upHandler = ({ key }) => {
	  console.log('uphandler', key)
		if (key === targetKey) {
			onPress();
		}
	};

	React.useEffect(() => {
		window.addEventListener('keyup', upHandler);

		return () => {
			window.removeEventListener('keyup', upHandler);
		};
	});

	return {};
};

export default useKeyPress;
