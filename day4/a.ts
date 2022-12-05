const input = await Deno.readTextFile('day4/input.txt');
const sectionsByElfPairs = input.split('\n');

// Part 1
// Convert range (e.g. 2-4) to array for iteration (e.g. [2,3,4])
const getSectionNumbers = (sectionRange: string): number[] => {
	const sectionRangeArray = sectionRange.split('-');
	const startingSection = Number(sectionRangeArray[0]);
	const endingSection = Number(sectionRangeArray[1]);
	if (!startingSection || !endingSection) return [];
	const sectionArray = Array.from({ length: endingSection - startingSection + 1 }, (_, i) => i + startingSection);
	return sectionArray;
};

// Find and store duplicate sections by each elf pair
const duplicateSectionsByElfPairs: number[][] = sectionsByElfPairs.map((sectionsByElfPair) => {
	const sectionsByElfPairArray = sectionsByElfPair.split(',');
	const sectionsByFirstElf = getSectionNumbers(sectionsByElfPairArray[0]);
	const sectionsBySecondElf = getSectionNumbers(sectionsByElfPairArray[1]);
	if (!sectionsByFirstElf || !sectionsBySecondElf) return [];

	const duplicateLetters = new Map();
	for (let firstElfIndex = 0; firstElfIndex < sectionsByFirstElf.length; firstElfIndex++) {
		for (let secondElfIndex = 0; secondElfIndex < sectionsBySecondElf.length; secondElfIndex++) {
			if (sectionsByFirstElf[firstElfIndex] === sectionsBySecondElf[secondElfIndex]) {
				duplicateLetters.set(sectionsByFirstElf[firstElfIndex], '');
			}
		}
	}
	const duplicateLettersInElfPair: number[] = [...duplicateLetters.keys()];
	return duplicateLettersInElfPair;
});

// Determine whether a section range is fully contained by duplicate sections
const numberOfElfPairsFullContained = sectionsByElfPairs.reduce((acc, sectionsByElfPair, index) => {
	const sectionsByElfPairArray = sectionsByElfPair.split(',');
	const sectionsByFirstElf = getSectionNumbers(sectionsByElfPairArray[0]);
	const sectionsBySecondElf = getSectionNumbers(sectionsByElfPairArray[1]);
	const isFirstSectionByFirstElfContained = duplicateSectionsByElfPairs[index].find((section) => section === sectionsByFirstElf[0]);
	const isLastSectionByFirstElfContained = duplicateSectionsByElfPairs[index].find(
		(section) => section === sectionsByFirstElf[sectionsByFirstElf.length - 1]
	);
	const isFirstSectionBySecondElfContained = duplicateSectionsByElfPairs[index].find((section) => section === sectionsBySecondElf[0]);
	const isLastSectionBySecondElfContained = duplicateSectionsByElfPairs[index].find(
		(section) => section === sectionsBySecondElf[sectionsBySecondElf.length - 1]
	);
	if (
		(isFirstSectionByFirstElfContained && isLastSectionByFirstElfContained) ||
		(isFirstSectionBySecondElfContained && isLastSectionBySecondElfContained)
	)
		return acc + 1;
	return acc;
}, 0);

console.log('numberOfElfPairsFullContained', numberOfElfPairsFullContained);

// Part 2
// Determine whether any section is duplicated
const numberOfElfPairsWithDuplicates = duplicateSectionsByElfPairs.reduce((acc, value) => (value && value.length > 0 ? acc + 1 : acc), 0);
console.log('numberOfElfPairsWithDuplicates', numberOfElfPairsWithDuplicates);
