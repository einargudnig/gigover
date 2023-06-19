export const handleFinishDate = (date: number | undefined): boolean => {
	const currentDate = new Date();
	const finishDate = date ? new Date(date) : undefined;

	// returns true if the finish date is defined and the current date is greater than the finish date
	return finishDate !== undefined && currentDate > finishDate;
};
