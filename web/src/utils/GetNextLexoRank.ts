import { LexoRank } from 'lexorank';

export const GetNextLexoRank = <T extends { lexoRank: string }>(
	list: T[],
	sourceIndex: number,
	destinationIndex: number
): LexoRank => {
	const undefinedLexoRank = LexoRank.min();

	// when a list is empty the first item gets the middle rank
	if (list.length === 0) {
		const firstItem = LexoRank.middle();
		return firstItem;
	} else if (list.length === 1 && sourceIndex === -1 && destinationIndex === list.length - 1) {
		// ! why this if statement?
		// there was weird bug when creating tasks.
		// Every single time a second task in a list was created it would *always* be placed at the top.
		// The second task created would automatically get higher rank than the first task.
		// All tasks created after the second one would be placed correctly.
		// This hack is to fix that and make the second task be placed correctly.
		// hence we are making sure this is only done when there is already one task in the list.
		const secondItem = LexoRank.middle().genPrev();
		return secondItem;
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
	if (destinationIndex === 0 && list.length === 1) {
		const firstItemRank = LexoRank.parse(list[0].lexoRank);
		return firstItemRank.genNext();
		// return destinationItemRank.genPrev();
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
