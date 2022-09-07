import { LexoRank } from 'lexorank';

export const GetNextLexoRank = <T extends { lexoRank: string }>(
	list: T[],
	sourceIndex: number,
	destinationIndex: number
): LexoRank => {
	const undefinedLexoRank = LexoRank.min();

	if (list.length === 0) {
		return LexoRank.middle();
	}

	// Current item being moved
	const currentItem = list[sourceIndex];

	// No need to move this item
	if (sourceIndex === destinationIndex) {
		return LexoRank.parse(currentItem.lexoRank);
	}

	const destinationItem: T | undefined = list[destinationIndex];
	const destinationItemRank = destinationItem
		? LexoRank.parse(destinationItem.lexoRank ?? undefinedLexoRank.toString())
		: LexoRank.middle();

	// If it is supposed to go to the top.
	if (destinationIndex === 0 && destinationItemRank) {
		return destinationItemRank.genPrev();
	}

	// Dropping to the bottom
	if (destinationIndex === list.length - 1) {
		const lastItem: T | undefined = list[list.length - 1];
		const lastItemRank = lastItem
			? LexoRank.parse(lastItem.lexoRank ?? undefinedLexoRank.toString())
			: LexoRank.max();
		return lastItemRank.genNext();
	}

	// If moving down
	if (sourceIndex < destinationIndex) {
		const nextItem: T | undefined = list[destinationIndex + 1];
		if (nextItem) {
			const nextItemRank = LexoRank.parse(nextItem.lexoRank ?? undefinedLexoRank.toString());

			if (nextItem.lexoRank === destinationItemRank.toString()) {
				return destinationItemRank.genNext();
			}

			return destinationItemRank.between(nextItemRank);
		} else {
			return destinationItemRank.genNext();
		}
	} else {
		// Moving up
		const prevItem: T | undefined = list[destinationIndex - 1];
		if (prevItem) {
			const prevItemRank = LexoRank.parse(prevItem.lexoRank ?? undefinedLexoRank.toString());

			if (prevItem.lexoRank === destinationItemRank.toString()) {
				return destinationItemRank.genPrev();
			}

			return prevItemRank.between(destinationItemRank);
		} else {
			return destinationItemRank.genPrev();
		}
	}
};
