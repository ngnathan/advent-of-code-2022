const rucksacks = await Deno.readTextFile('day3/input.txt');

// Part 1
// Get sum of priorities from duplicate letters in rucksacks
// Unknowns:
// - Unsure if each rucksack has multiple duplicate letters

// Find and store duplicate letters in an array of rucksacks
// Each rucksack has an array in case there are multiple duplicate characters
// Use a JS Map object to get unique keys
const duplicateLettersInRucksacks = rucksacks.split('\n').map((rucksack) => {
	const priority = new Map();

	// Get duplicate strings from left and right compartment
	const leftCompartment = rucksack.substring(0, Math.floor(rucksack.length / 2));
	const rightCompartment = rucksack.substring(Math.ceil(rucksack.length / 2));
	for (let leftIndex = 0; leftIndex < leftCompartment.length; leftIndex++) {
		for (let rightIndex = 0; rightIndex < rightCompartment.length; rightIndex++) {
			if (leftCompartment.charAt(leftIndex) === rightCompartment.charAt(rightIndex)) {
				priority.set(leftCompartment.charAt(leftIndex), '');
			}
		}
	}

	return [...priority.keys()];
});

// Get priority per letter returned
// Assumes letter is at position 0 of string
const getPriorityByLetter = (letter: string) => {
	let priority = 0;
	const charCode = letter.charCodeAt(0);
	if (charCode >= 65 && charCode <= 90) {
		priority = charCode - 38;
	} else if (charCode >= 97 && charCode <= 122) {
		priority = charCode - 96;
	}
	return priority;
};

// Calculate sum of priorities for duplicate letters in rucksacks
const sumOfPriorities = duplicateLettersInRucksacks.reduce((acc, duplicateLettersPerRucksack) => {
	return acc + duplicateLettersPerRucksack.reduce((acc, value) => acc + Number(getPriorityByLetter(value)), 0);
}, 0);
console.log('sumOfPriorities', sumOfPriorities);

// Part 2
// Get sum of priorities from all three-elf groups

// Find and store duplicate letters in array of three-elf groups
const duplicateLettersInThreeElfGroups = rucksacks.split('\n').reduce((acc, rucksack, index) => {
	// Push new group of characters every 3 lines
	if (index % 3 === 0) {
		return [...acc, rucksack];
	}
	// If next rucksack belongs to the previous group, find and store duplicate chars
	// Use Map object to store unique chars
	else {
		const updatedAcc = [...acc];
		const prevRucksack = updatedAcc[updatedAcc.length - 1];
		const duplicateLetters = new Map<string, string>();
		for (let prevRucksackIndex = 0; prevRucksackIndex < prevRucksack.length; prevRucksackIndex++) {
			for (let currentRucksackIndex = 0; currentRucksackIndex < rucksack.length; currentRucksackIndex++) {
				if (prevRucksack[prevRucksackIndex] === rucksack[currentRucksackIndex]) {
					duplicateLetters.set(prevRucksack[prevRucksackIndex], '');
				}
			}
		}
		updatedAcc[updatedAcc.length - 1] = [...duplicateLetters.keys()].toLocaleString();
		return updatedAcc;
	}
}, [] as string[]);

// Calculate sum of priorities for duplicate letters in three-elf groups
const sumOfPriorities2 = duplicateLettersInThreeElfGroups.reduce((acc, value) => acc + Number(getPriorityByLetter(value)), 0);
console.log('sumOfPriorities2', sumOfPriorities2);
