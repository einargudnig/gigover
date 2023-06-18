export const handleFinishDate = (date: number): boolean => {
	const currentDate = new Date();
	const finishDate = new Date(date);
	// returns true if the current date is greater than the finish date
	// should invert to use with better understanding
	return currentDate > finishDate;
};
